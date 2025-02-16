import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});

test('purchase with login', async ({ page }) => {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: 'LotaPizza',
        stores: [
          { id: 4, name: 'Lehi' },
          { id: 5, name: 'Springville' },
          { id: 6, name: 'American Fork' },
        ],
      },
      { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
      { id: 4, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: 'Veggie', price: 0.0038 },
        { menuId: 2, description: 'Pepperoni', price: 0.0042 },
      ],
      storeId: '4',
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
        id: 23,
      },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });

  await page.goto('/');

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();
});


test('CRUD operations on franchises as franchisee', async ({ page }) => {

  // await page.route('*/**/api/auth', async (route) => {
  //   const authRes = [
  //     {"user":{"id":3,"name":"pizza franchisee","email":"f@jwt.com","roles":[{"role":"diner"},{"objectId":1,"role":"franchisee"}]},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InBpenphIGZyYW5jaGlzZWUiLCJlbWFpbCI6ImZAand0LmNvbSIsInJvbGVzIjpbeyJyb2xlIjoiZGluZXIifSx7Im9iamVjdElkIjoxLCJyb2xlIjoiZnJhbmNoaXNlZSJ9XSwiaWF0IjoxNzM5NjcxODM2fQ.vyWvt2xIjBYfoa1VJ03IDiZuluJPkuvz14NMD81wIu8"}
  //   ];
  //   expect(route.request().method()).toBe('PUT');
  //   await route.fulfill({ json: authRes });
  // });

  await page.route('*/**/api/franchise/3', async (route) => {
    const franchiseRes = [
      {"id":1,"name":"pizzaPocket","admins":[{"id":3,"name":"pizza franchisee","email":"f@jwt.com"}],"stores":[{"id":1,"name":"SLC","totalRevenue":0},{"id":8,"name":"Provo","totalRevenue":0}]}
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/franchise/1/store', async (route) => {
    const storeRes = [
      {"id":3,"franchiseId":8,"name":"Provo"}
    ];
    expect(route.request().method()).toBe('POST');
    await route.fulfill({ json: storeRes });
  });

  await page.route('*/**/api/franchise/1/store/8', async (route) => {
    const deleteRes = [
      { "message": "store deleted" }
    ];
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: deleteRes });
  });

  //Log in as Franchisee
  await page.goto('http://localhost:5173');
  await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');
  await page.getByRole('contentinfo').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?');
  await page.getByRole('link', { name: 'login', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('tbody')).toContainText('SLC');

  //Create new store
  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByRole('textbox', { name: 'store name' }).click();
  await page.getByRole('textbox', { name: 'store name' }).fill('Provo');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.locator('tbody')).toContainText('Provo');
  
  //Delete store
  await page.getByRole('row', { name: 'Provo 0 ₿ Close' }).getByRole('button').click();
  await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
  await page.getByRole('button', { name: 'Close' }).click();
  
});


test('View profile as diner', async ({ page }) => {
  // await page.route('*/**/api/auth', async (route) => {
  //   const authRes = [
  //     {"user":{"id":2,"name":"pizza diner","email":"d@jwt.com","roles":[{"role":"diner"}]},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6InBpenphIGRpbmVyIiwiZW1haWwiOiJkQGp3dC5jb20iLCJyb2xlcyI6W3sicm9sZSI6ImRpbmVyIn1dLCJpYXQiOjE3Mzk2NzI4MTh9._jSqTGBBItML8csO3s4daZeENZwYWh_VvEjrE_j5a7o"}
  //   ];
  //   expect(route.request().method()).toBe('PUT');
  //   await route.fulfill({ json: authRes });
  // });

  await page.route('*/**/api/order', async (route) => {
    const orderRes = [
      {"dinerId":2,"orders":[],"page":1}
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: orderRes });
  });


  // await page.route('*/**/api/auth', async (route) => {
  //   const authRes = [
  //     { "message": "logout successful" }
  //   ];
  //   expect(route.request().method()).toBe('DELETE');
  //   await route.fulfill({ json: authRes });
  // });


  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'pd' }).click();
  await expect(page.getByRole('heading')).toContainText('Your pizza kitchen');
  await expect(page.getByRole('main')).toContainText('pizza diner');
  await page.getByRole('link', { name: 'Logout' }).click();
});

test('View admin page', async ({ page }) => {
  // await page.route('*/**/api/auth', async (route) => {
  //   const authRes = [
  //     {"user":{"id":1,"name":"常用名字","email":"a@jwt.com","roles":[{"role":"admin"}]},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IuW4uOeUqOWQjeWtlyIsImVtYWlsIjoiYUBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJhZG1pbiJ9XSwiaWF0IjoxNzM5NjczNTUyfQ.QY7DJhu7KvEgV502poxSNjf-U6UecLlem_Q7PG0CIMA"}
  //   ];
  //   expect(route.request().method()).toBe('PUT');
  //   await route.fulfill({ json: authRes });
  // });

  await page.route('*/**/api/franchise', async (route) => {
    let franRes = [];
    if (route.request().method() === 'GET') {
      franRes = [
        {"id":1,"name":"pizzaPocket","admins":[{"id":3,"name":"pizza franchisee","email":"f@jwt.com"}],"stores":[{"id":1,"name":"SLC","totalRevenue":0},{"id":10,"name":"Provo","totalRevenue":0}]},{"id":5,"name":"TestFranchise","admins":[{"id":1,"name":"常用名字","email":"a@jwt.com"}],"stores":[]}
      ];
    }
    else if(route.request().method() === 'POST') {
      franRes = [
        {"stores":[],"id":"","name":"TestFranchise","admins":[{"email":"a@jwt.com"}]}
      ];
    } else {
      console.log(route.request().method())
    }
    
    await route.fulfill({ json: franRes });
    
  });

  await page.route('*/**/api/franchise/5', async (route) => {
    const authRes = [
      {
        "message": "franchise deleted"
      }
    ];
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: authRes });
  });

  // Navigate to Admin page
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('heading')).toContainText('Mama Ricci\'s kitchen');
  
  // Add Franchise
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await expect(page.getByRole('heading')).toContainText('Create franchise');
  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('TestFranchise');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('a@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('table')).toContainText('TestFranchise');
  await expect(page.getByRole('table')).toContainText('常用名字');

  // Delete Franchise
  await page.getByRole('row', { name: 'TestFranchise 常用名字 Close' }).getByRole('button').click();
  await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
  await page.getByRole('button', { name: 'Close' }).click();
});



function randomName() {
  return Math.random().toString(36).substring(2, 12);
}