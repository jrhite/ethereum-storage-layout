//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract StorageLayoutExamples {
    struct S { uint16 a; uint16 b; uint256 c; }
    uint16 public a;
    uint16 public b;
    uint public c;
    uint[] public dataArray;
    mapping(uint => S) public structDataMap;
    mapping(uint => mapping(uint => S)) public nestedStructDataMap;
    address public anAddress;

    constructor() {
        a = 217;
        b = 14;
        
        c = 33;
        
        dataArray.push(22);
        dataArray.push(41);
        
        structDataMap[5] = S(3320, 10, 765);
        structDataMap[8] = S(504, 32, 88);

        nestedStructDataMap[3][4] = S(6, 581, 72);
        nestedStructDataMap[14][2] = S(8411, 646, 78099);

        anAddress = 0x334E9959781a3f1186666ddC2f46E58d0da8fF26;
    }
}
