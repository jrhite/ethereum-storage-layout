//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract StorageLayoutContract {
    struct S { uint16 a; uint16 b; uint256 c; }

    // slot 0
    uint256 public a;

    // slot 1 (packed)
    uint16 public b;
    uint16 public c;
    
    // slot 2 (array marker and size)
    uint256[] public dataArray;

    // slot 3 (array marker and size)
    uint256[][] public nestedDataArray;

    // slot 4 (mapping marker)
    mapping(uint256 => uint256) public dataMap;

    // slot 5 (mapping marker)
    mapping(uint256 => S) public structDataMap;

    // slot 6 (mapping marker)
    mapping(uint256 => mapping(uint256 => S)) public nestedStructDataMap;

    // slot 7
    address public anAddress;

    constructor() {
        a = 217995848383212;       // 0xC6441D1AFAEC

        b = 11430;                 // 0x2CA6
        c = 9071;                  // 0x236F
        
        dataArray.push(22);        // 0x16
        dataArray.push(41);        // 0x29
        dataArray.push(98021);     // 0x17EE5

        nestedDataArray.push([55, 774, 17]);
        nestedDataArray.push([1111, 4421]);

        dataMap[5] = 3320;         // 0xCF8
        dataMap[202] = 11987;      // 0x2ED3

        // 0x36E, 0xA, 0x2FD
        structDataMap[11] = S(878, 10, 765);
        // 0x1F8, 0x20, 0x58
        structDataMap[88] = S(504, 32, 88);

        // 0x6, 0x245, 0x48
        nestedStructDataMap[3][4] = S(6, 581, 72);

        // 0x20DB, 0x286, 0x13113
        nestedStructDataMap[14][2] = S(8411, 646, 78099);

        anAddress = 0x334E9959781a3f1186666ddC2f46E58d0da8fF26;
    }
}
