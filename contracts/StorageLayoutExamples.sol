//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract StorageLayoutExamples {
    struct S { uint16 a; uint16 b; uint256 c; }

    // slot 0
    uint16 public a;
    uint16 public b;

    // slot 1
    uint256 public c;
    
    // slot 2 (array marker and size)
    uint256[] public dataArray;

    // slot 3 (array marker and size)
    uint256[][] public nestedDataArray;

    // slot 4 (mapping marker)
    mapping(uint256 => S) public structDataMap;

    // slot 5 (mapping marker)    
    mapping(uint256 => mapping(uint256 => S)) public nestedStructDataMap;

    address public anAddress;

    constructor() {
        a = 217;              // 0xD9
        b = 14;               // 0xE
        
        c = 33;               // 0x21
        
        dataArray.push(22);     // 0x16
        dataArray.push(41);     // 0x29
        dataArray.push(98021);  // 0x17EE5

        nestedDataArray.push([55, 774, 17]);
        nestedDataArray.push([1111, 4421]);
        
        // 0xCF8, 0xA, 0x2FD
        structDataMap[5] = S(3320, 10, 765);

        // 0x1F8, 0x20, 0x58
        structDataMap[8] = S(504, 32, 88);

        // 0x6, 0x245, 0x48
        nestedStructDataMap[3][4] = S(6, 581, 72);

        // 0x20DB, 0x286, 0x13113
        nestedStructDataMap[14][2] = S(8411, 646, 78099);

        anAddress = 0x334E9959781a3f1186666ddC2f46E58d0da8fF26;
    }
}
