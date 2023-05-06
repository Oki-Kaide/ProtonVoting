#pragma once

// Standard.
#include <vector>

// EOS
#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/crypto.hpp>
#include <eosio/transaction.hpp>

struct ChoiceBase {
  std::string value;
  std::string subtitle;
};
struct Choice: ChoiceBase {
  uint64_t votes = 0;
};
namespace proton {
  CONTRACT atom : public eosio::contract {
  public:
    using contract::contract;

    atom( eosio::name receiver, eosio::name code, eosio::datastream<const char*> ds )
      : contract(receiver, code, ds),
        _polls(receiver, receiver.value) {}

    ACTION createpoll (
      const eosio::name& account,
      const std::vector<ChoiceBase>& choices,
      const uint64_t& starts_at,
      const uint64_t& ends_at,
      const std::string& description
    );
    ACTION deletepoll (
      const eosio::name& creator,
      const uint64_t& poll_id
    );
    ACTION vote (
      const eosio::name relay,
      const uint64_t& poll_id,
      const std::string& choice,
      const eosio::public_key& key,
      const eosio::signature& signature
    );

    ACTION resetpool (
      const uint64_t& poll_id
    ) {
      require_auth(get_self());
      votes_table _votes(get_self(), poll_id);
      auto itr = _votes.end();
      while(_votes.begin() != itr){
        itr = _votes.erase(--itr);
      }
    };

    ACTION modifyend (
      const eosio::name& creator,
      const uint64_t& poll_id,
      const uint64_t& ends_at
    );

    // Define table
    TABLE Vote {
      uint64_t index;
      std::string choice;
      eosio::public_key key;
      eosio::checksum256 txid;

      uint64_t primary_key() const { return index; };
      eosio::checksum256 by_key_hash() const {
        return hash_key(key);
      };
      
      EOSLIB_SERIALIZE(Vote, (index)(choice)(key)(txid));
    };

    TABLE Poll {
      uint64_t index;
      eosio::name creator;
      std::vector<Choice> choices = {};
      uint64_t starts_at;
      uint64_t ends_at;
      std::string description;

      uint64_t primary_key() const { return index; };
    };

    typedef eosio::multi_index<"polls"_n, Poll> polls_table;
    typedef eosio::multi_index<"votes"_n, Vote,
      eosio::indexed_by<eosio::name("bykeyhash"), eosio::const_mem_fun<Vote, eosio::checksum256, &Vote::by_key_hash>>
    > votes_table;

    // Initialize table
    polls_table _polls;

  private:
    // Private functions (not in ABI)
    static inline eosio::checksum256 hash_key(eosio::public_key key) {
      eosio::ecc_public_key public_key_data = std::get<0>(key);
      return eosio::sha256(public_key_data.data(), public_key_data.size());
    }

    static inline eosio::checksum256 get_txid () {
      auto size = eosio::transaction_size();
      char buf[size];
      uint32_t read = eosio::read_transaction(buf, size);
      eosio::check( size == read, "read_transaction failed");
      return eosio::sha256(buf, size);
    }
  };
}