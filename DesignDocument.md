# Design Document

Authors: Andriano Davide, Hakimifard Pouya, Sunder Giulio, Talakoobi Alireza

Date: 27-04-2022

Version: 1.0

# Contents

- [Design Document](#design-document)
- [Contents](#contents)
- [Instructions](#instructions)
- [High level design](#high-level-design)
- [Low level design](#low-level-design)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)

# Instructions

The design must satisfy the Official Requirements document

# High level design

The pattern used for our project is a Three-Tier layered MVC pattern. The application must collect informations, use and modify them showing the changes on the view layer.

![image](/src/high_lvl.jpg)

# Low level design

![image](/src/Main.jpg)

The class diagram implements a facade structural pattern, which is the EZWHSystem class, for interfacing with all the classes of the model.

# Verification traceability matrix

| Function | EZWHSystem | TestDescriptor | Position | RestockOrder | InternalOrder | TestResult | ReturnOrder | SKUItem | SKU | Item | User |
| :------: | :--------: | :------------: | :------: | :----------: | :-----------: | :--------: | :---------: | :-----: | :-: | :--: | :--: |
|   FR1    |     ×      |                |          |              |               |            |             |         |     |      |  ×   |
|   FR2    |     ×      |                |    ×     |              |               |            |             |         |  ×  |      |      |
|   FR3    |     ×      |       x        |    ×     |              |               |     x      |             |         |     |      |      |
|   FR4    |     ×      |                |          |              |               |            |             |         |     |      |  ×   |
|   FR5    |     ×      |                |          |      ×       |               |     x      |      x      |    x    |  x  |  x   |      |
|   FR6    |     ×      |                |          |              |       ×       |            |             |    x    |  x  |      |      |
|   FR7    |     ×      |                |          |              |               |            |             |         |  x  |  ×   |  x   |

# Verification sequence diagrams

##Scenario 1.1  
![image](/src/SequenceDiagrams/UC_1-1.png)  
##Scenario 2.1  
![image](src/SequenceDiagrams/UC2.jpg)  
##Scenario 3.2  
![image](/src/SequenceDiagrams/UC_3-2.png)  
##Scenario 4.1  
![image](/src/SequenceDiagrams/4.jpg)  
##Scenario 5.1.1  
![image](/src/SequenceDiagrams/UC_5-1-1.png)  
##Scenario 5.2.1  
![image](/src/SequenceDiagrams/5.2.jpg)  
##Scenario 5.3.1  
![image](/src/SequenceDiagrams/5.3.jpg)  
##Scenario 6.1  
![image](/src/SequenceDiagrams/6.jpg)  
##Scenario 7.1  
![image](/src/SequenceDiagrams/UC_7-1.png)  
##Scenario 9.1 & 10.1  
![image](/src/SequenceDiagrams/UC_9-1.png)  
##Scenario 11.1  
![image](/src/SequenceDiagrams/UC_11-1.png)  
##Scenario 12.1  
![image](/src/SequenceDiagrams/12.jpg)
