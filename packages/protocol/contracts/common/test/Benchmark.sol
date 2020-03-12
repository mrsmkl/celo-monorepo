pragma solidity ^0.5.8;

import "../UsingPrecompiles.sol";

contract Benchmark is UsingPrecompiles {
  function baseline(uint256 num) external pure returns (uint256) {
    uint256 acc = num;
    for (uint256 i = 0; i < num; i++) {
      acc = num + i * acc;
      acc = acc / 23;
    }
    return acc;
  }

  // baseline for reading data from blockchain (hashes)
  function baselineHash(uint256 num) external view returns (uint256) {
    uint256 acc = num;
    for (uint256 i = 0; i < num; i++) {
      acc = num + i * acc;
      acc = acc + uint256(blockhash(block.number - (1 + (num % 256))));
    }
    return acc;
  }

  // epoch size
  function benchEpochsize(uint256 num) external view returns (uint256) {
    uint256 acc = num;
    for (uint256 i = 0; i < num; i++) {
      acc = acc + getEpochSize();
    }
    return acc;
  }

  function benchNumValidators(uint256 num) external view returns (uint256) {
    uint256 acc = num;
    for (uint256 i = 0; i < num; i++) {
      acc = acc + numberValidatorsInCurrentSet();
    }
    return acc;
  }

  function benchGetValidator(uint256 num) external view returns (uint256) {
    uint256 acc = num;
    for (uint256 i = 0; i < num; i++) {
      acc = acc + uint256(validatorSignerAddressFromSet(0, block.number - (1 + (num % 256))));
    }
    return acc;
  }

  function benchParentSeal(uint256 num) external view returns (uint256) {
    uint256 acc = num;
    uint256 size = 4 * getEpochSize();
    for (uint256 i = 0; i < num; i++) {
      acc = acc + uint256(getParentSealBitmap(block.number - (1 + (num % size))));
    }
    return acc;
  }

  function benchPoP(uint256 num, address sender, bytes memory blsKey, bytes memory blsPop)
    public
    view
    returns (uint256)
  {
    uint256 acc = num;
    for (uint256 i = 0; i < num; i++) {
      acc = acc + (checkProofOfPossession(sender, blsKey, blsPop) ? acc : num);
    }
    return acc;
  }

  function benchHashHeader(uint256 num, bytes memory header) public view returns (uint256) {
    uint256 acc = num;
    for (uint256 i = 0; i < num; i++) {
      acc = acc + uint256(hashHeader(header));
    }
    return acc;
  }

  function benchReadHeader(uint256 num, bytes memory header) public view returns (uint256) {
    uint256 acc = num;
    for (uint256 i = 0; i < num; i++) {
      acc = acc + getBlockNumberFromHeader(header);
    }
    return acc;
  }

  function benchReadSealHeader(uint256 num, bytes memory header) public view returns (uint256) {
    uint256 acc = num;
    for (uint256 i = 0; i < num; i++) {
      acc = acc + uint256(getVerifiedSealBitmapFromHeader(header));
    }
    return acc;
  }

  function benchFraction(uint256 num, uint256 exponent, uint256 _decimals) public view {
    for (uint256 i = 0; i < num; i++) {
      fractionMulExp(
        uint256(keccak256("1")),
        uint256(keccak256("2")),
        uint256(keccak256("3")),
        uint256(keccak256("4")),
        exponent,
        _decimals
      );
    }
  }

}
