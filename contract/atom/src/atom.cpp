#include <atom/atom.hpp>

namespace proton
{
  void atom::createpoll (
    const eosio::name& account,
    const std::vector<ChoiceBase>& choices,
    const uint64_t& starts_at,
    const uint64_t& ends_at,
    const std::string& description
  ) {
    require_auth(account);

    eosio::check(starts_at < ends_at, "Starting time must be before ending time");
    eosio::check(ends_at > eosio::current_time_point().sec_since_epoch(), "Ending time must be in the future");
    
    _polls.emplace(account, [&](auto& p) {
      p.index = _polls.available_primary_key();
      p.creator = account;
      p.starts_at = starts_at;
      p.ends_at = ends_at;
      p.description = description;

      std::transform(choices.begin(), choices.end(), std::back_inserter(p.choices), [](ChoiceBase choice) -> Choice {
        eosio::check(choice.subtitle.size() < 100, "subtitle can be max 100 characters long");
        return { choice.value, choice.subtitle, 0 };
      });
    });
  }

  void atom::deletepoll (
    const eosio::name& creator,
    const uint64_t& poll_id
  ) {
    require_auth(creator);
    auto poll = _polls.require_find(poll_id, "Poll not found.");
    eosio::check(poll->creator == creator, "Not the creator");
    _polls.erase(poll);
  }

  void atom::modifyend (
    const eosio::name& creator,
    const uint64_t& poll_id,
    const uint64_t& ends_at
  ) {
    require_auth(creator);
    auto poll = _polls.require_find(poll_id, "Poll not found.");
    eosio::check(poll->creator == creator, "Not the creator");
    _polls.modify(poll, creator, [&](auto& p) {
      p.ends_at = ends_at;
    });
  }

  void atom::vote (
    const eosio::name relay,
    const uint64_t& poll_id,
    const std::string& choice,
    const eosio::public_key& key,
    const eosio::signature& signature
  ) {
    require_auth(get_self());

    // Get poll
    auto poll = _polls.require_find(poll_id, "Poll not found.");
    auto current_time = eosio::current_time_point().sec_since_epoch();
    eosio::check(current_time >= poll->starts_at, "Poll has not started yet.");
    eosio::check(current_time < poll->ends_at, "Poll has already ended;");
    auto choice_itr = std::find_if(poll->choices.begin(), poll->choices.end(), [choice](Choice c){return c.value == choice;});
    eosio::check(choice_itr != poll->choices.end(), "Choice is not one of the available options");

    // Check that the choice, key and signature are valid
    std::string data_to_hash = std::to_string(poll_id) + ":" + choice;
    eosio::checksum256 choice_digest = eosio::sha256(data_to_hash.data(), data_to_hash.size());
    eosio::public_key recovered_key = eosio::recover_key(choice_digest, signature);
    eosio::check(recovered_key == key, "Invalid signature or key provided.");

    // Add to count
    _polls.modify(poll, eosio::same_payer, [&](auto& p) {
      auto choice_itr = std::find_if(p.choices.begin(), p.choices.end(), [choice](Choice c){
        return c.value == choice;
      });
      choice_itr->votes++;
    });

    // Vote table
    votes_table _votes(get_self(), poll_id);
    auto hashed_key = hash_key(key);
    auto votes_bykey_hash = _votes.get_index<eosio::name("bykeyhash")>();
    auto vote_itr = votes_bykey_hash.find(hashed_key);

    // Vote does not exist -> Add vote
    if (vote_itr == votes_bykey_hash.end())
    {
      _votes.emplace(relay, [&](auto& v) {
        v.index = _votes.available_primary_key();
        v.choice = choice;
        v.key = key;
        v.txid = get_txid();
      });
    }
    else
    {
      eosio::check(false, "this key has already voted");
    }
  }
} // namepsace contract