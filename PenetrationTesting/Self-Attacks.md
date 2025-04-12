### Example attack record

| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | June 18, 2053                                                                  |
| Target         | pizza.byucsstudent.click                                                       |
| Classification | Injection                                                                      |
| Severity       | 1                                                                              |
| Description    | SQL injection deleted database. All application data destroyed.                |
| Images         | ![Dead database](deadDatabase.png) <br/> Stores and menu no longer accessible. |
| Corrections    | Sanitize user inputs.                                                          |


| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | April 12, 2025                                                                 |
| Target         | pizza.storyweave.click                                                         |
| Classification | Identification and Authentication Failures                                     |
| Severity       | 3                                                                              |
| Description    | Brute forced admin password. Gained access to admin account. Used the top 10,000 most common passwords. |
| Images         | ![Admin Password Attack](BruteForceAdminPasswordAttack.png) <br/> 200 Response indicates we found correct credentials. 
                   ![Admin Password Attack Query](BruteForceAdminPasswordAttackQuery.png) <br/> Iterated through the top 10000 passwords. |
| Corrections    | All accounts now have more secure passwords, with a combination of uppercase, lowercase, numbers, and symbols. |

