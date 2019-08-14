pragma solidity ^0.5.8;


contract MsgSenderCheck {
  function checkMsgSender(address addr) external view {
    require(addr == msg.sender, "address was not msg.sender");
  }
}
