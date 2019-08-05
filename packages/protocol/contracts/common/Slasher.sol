pragma solidity ^0.5.8;

import "./UsingRegistry.sol";

import "../governance/interfaces/IBondedDeposits.sol";
import "../governance/interfaces/IGovernance.sol";
import "../governance/interfaces/IValidators.sol";

contract Slasher is UsingRegistry {
  function evalSlashCondition(address account) public view returns (bool);
  function getSlashAmount(address account) public view returns (uint256);
  function cleanupSlashCondition(address account) private;

  function claimSlashCondition(
    address account,
    uint256 lesserProposalId,
    uint256 greaterProposalId,
    address lesserValidatorGroup,
    address greaterValidatorGroup
  ) public {
    require(evalSlashCondition(account));

    IBondedDeposits bondedDeposits = IBondedDeposits(
      registry.getAddressFor(BONDED_DEPOSITS_REGISTRY_ID)
    );
    uint256 oldWeight = bondedDeposits.getAccountWeight(account);
    require(oldWeight > 0); // TODO: evaluate effects
    bondedDeposits.slash(account, getSlashAmount(account), msg.sender);

    IGovernance governance = IGovernance(registry.getAddressFor(GOVERNANCE_REGISTRY_ID));
    governance.balanceUpvote(account, oldWeight, lesserProposalId, greaterProposalId);
    // TOOD(yorke): investigate changing referendum proposal tallies
    // requires modifying how history of VoteRecords is kept

    IValidators validators = IValidators(registry.getAddressFor(VALIDATORS_REGISTRY_ID));
    validators.balanceVote(account, oldWeight, lesserValidatorGroup, greaterValidatorGroup);

    cleanupSlashCondition(account);
  }
}
