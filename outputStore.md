1. GET api/stores/
   output :
   status 200 =
   {
   "message": "success",
   "data": [
   {
   "id": 1,
   "name": "Boss Electronic",
   "location": "Bali",
   "category": "Electronic",
   "code": "OWSS-BAL-EL-24-08-14-20-2",
   "OwnerId": 2,
   "createdAt": "2024-08-14T13:18:25.256Z",
   "updatedAt": "2024-08-14T13:18:25.256Z",
   "employees": [
   {
   "id": 5,
   "firstName": "Luthfi",
   "lastName": "Jamil",
   "dateOfBirth": "1992-03-03T00:00:00.000Z",
   "contact": "7777777777",
   "education": "Bachelor",
   "address": "Jl. Bali No. 4",
   "position": "Cashier",
   "salary": 2500000,
   "UserId": 7,
   "StoreId": 1,
   "createdAt": "2024-08-14T13:18:25.263Z",
   "updatedAt": "2024-08-14T13:18:25.263Z",
   "payrolls": [
   {
   "id": 5,
   "date": "2024-08-01T00:00:00.000Z",
   "amount": 2500000,
   "status": "PAID",
   "EmployeeId": 5,
   "createdAt": "2024-08-14T13:18:25.277Z",
   "updatedAt": "2024-08-14T13:18:25.277Z"
   }
   ],
   "attendances": [
   {
   "id": 10,
   "date": "2024-08-23T00:00:00.000Z",
   "status": "Absent",
   "EmployeeId": 5,
   "createdAt": "2024-08-14T13:18:25.270Z",
   "updatedAt": "2024-08-14T13:18:25.270Z"
   },
   {
   "id": 9,
   "date": "2024-08-22T00:00:00.000Z",
   "status": "Present",
   "EmployeeId": 5,
   "createdAt": "2024-08-14T13:18:25.270Z",
   "updatedAt": "2024-08-14T13:18:25.270Z"
   }
   ],
   "user": {
   "id": 7,
   "userName": "employee2",
   "email": "employee2@mail.com",
   "role": "EMPLOYEE",
   "createdAt": "2024-08-14T13:18:24.970Z",
   "updatedAt": "2024-08-14T13:18:24.970Z"
   }
   },
   {
   "id": 3,
   "firstName": "John",
   "lastName": "Doe",
   "dateOfBirth": "1990-01-01T00:00:00.000Z",
   "contact": "123456789",
   "education": "Bachelor",
   "address": "Jl. Bali No. 1",
   "position": "Sales Admin",
   "salary": 5000000,
   "UserId": 5,
   "StoreId": 1,
   "createdAt": "2024-08-14T13:18:25.263Z",
   "updatedAt": "2024-08-14T13:18:25.263Z",
   "payrolls": [
   {
   "id": 3,
   "date": "2024-08-01T00:00:00.000Z",
   "amount": 3000000,
   "status": "PAID",
   "EmployeeId": 3,
   "createdAt": "2024-08-14T13:18:25.277Z",
   "updatedAt": "2024-08-14T13:18:25.277Z"
   }
   ],
   "attendances": [
   {
   "id": 6,
   "date": "2024-08-23T00:00:00.000Z",
   "status": "Absent",
   "EmployeeId": 3,
   "createdAt": "2024-08-14T13:18:25.270Z",
   "updatedAt": "2024-08-14T13:18:25.270Z"
   },
   {
   "id": 5,
   "date": "2024-08-22T00:00:00.000Z",
   "status": "Present",
   "EmployeeId": 3,
   "createdAt": "2024-08-14T13:18:25.270Z",
   "updatedAt": "2024-08-14T13:18:25.270Z"
   }
   ],
   "user": {
   "id": 5,
   "userName": "manager2",
   "email": "manager2@mail.com",
   "role": "MANAGER",
   "createdAt": "2024-08-14T13:18:24.790Z",
   "updatedAt": "2024-08-14T13:18:24.790Z"
   }
   },
   {
   "id": 4,
   "firstName": "Emily",
   "lastName": "Brown",
   "dateOfBirth": "1992-03-03T00:00:00.000Z",
   "contact": "7777777777",
   "education": "Bachelor",
   "address": "Jl. Bali No. 4",
   "position": "Cashier",
   "salary": 2500000,
   "UserId": 6,
   "StoreId": 1,
   "createdAt": "2024-08-14T13:18:25.263Z",
   "updatedAt": "2024-08-14T13:18:25.263Z",
   "payrolls": [
   {
   "id": 4,
   "date": "2024-08-01T00:00:00.000Z",
   "amount": 2500000,
   "status": "PAID",
   "EmployeeId": 4,
   "createdAt": "2024-08-14T13:18:25.277Z",
   "updatedAt": "2024-08-14T13:18:25.277Z"
   }
   ],
   "attendances": [
   {
   "id": 7,
   "date": "2024-08-22T00:00:00.000Z",
   "status": "Present",
   "EmployeeId": 4,
   "createdAt": "2024-08-14T13:18:25.270Z",
   "updatedAt": "2024-08-14T13:18:25.270Z"
   },
   {
   "id": 8,
   "date": "2024-08-23T00:00:00.000Z",
   "status": "Absent",
   "EmployeeId": 4,
   "createdAt": "2024-08-14T13:18:25.270Z",
   "updatedAt": "2024-08-14T13:18:25.270Z"
   }
   ],
   "user": {
   "id": 6,
   "userName": "employee1UpdateLagi2",
   "email": "employee1@mail.com",
   "role": "EMPLOYEE",
   "createdAt": "2024-08-14T13:18:24.880Z",
   "updatedAt": "2024-08-14T16:04:30.124Z"
   }
   }
   ]
   },
   {
   "id": 3,
   "name": "Boss Gardening",
   "location": "Bandung",
   "category": "Gardening",
   "code": "OWSS-BAN-GA-24-08-14-20-2",
   "OwnerId": 2,
   "createdAt": "2024-08-14T13:18:25.256Z",
   "updatedAt": "2024-08-14T13:18:25.256Z",
   "employees": [
   {
   "id": 2,
   "firstName": "Mike",
   "lastName": "Johnson",
   "dateOfBirth": "1993-08-08T00:00:00.000Z",
   "contact": "5555555555",
   "education": "Bachelor",
   "address": "Jl. Bandung No. 3",
   "position": "Cashier",
   "salary": 2500000,
   "UserId": 4,
   "StoreId": 3,
   "createdAt": "2024-08-14T13:18:25.263Z",
   "updatedAt": "2024-08-14T13:18:25.263Z",
   "payrolls": [
   {
   "id": 2,
   "date": "2024-08-01T00:00:00.000Z",
   "amount": 5000000,
   "status": "PAID",
   "EmployeeId": 2,
   "createdAt": "2024-08-14T13:18:25.277Z",
   "updatedAt": "2024-08-14T13:18:25.277Z"
   }
   ],
   "attendances": [
   {
   "id": 3,
   "date": "2024-08-22T00:00:00.000Z",
   "status": "Present",
   "EmployeeId": 2,
   "createdAt": "2024-08-14T13:18:25.270Z",
   "updatedAt": "2024-08-14T13:18:25.270Z"
   },
   {
   "id": 4,
   "date": "2024-08-23T00:00:00.000Z",
   "status": "Absent",
   "EmployeeId": 2,
   "createdAt": "2024-08-14T13:18:25.270Z",
   "updatedAt": "2024-08-14T13:18:25.270Z"
   }
   ],
   "user": {
   "id": 4,
   "userName": "manager1",
   "email": "manager1@mail.com",
   "role": "MANAGER",
   "createdAt": "2024-08-14T13:18:24.694Z",
   "updatedAt": "2024-08-14T13:18:24.694Z"
   }
   }
   ]
   },
   {
   "id": 2,
   "name": "Boss Toy",
   "location": "Jakarta",
   "category": "Toy",
   "code": "OWSS-JAK-TO-24-08-14-20-2",
   "OwnerId": 2,
   "createdAt": "2024-08-14T13:18:25.256Z",
   "updatedAt": "2024-08-14T13:18:25.256Z",
   "employees": [
   {
   "id": 1,
   "firstName": "Jane",
   "lastName": "Smith",
   "dateOfBirth": "1995-05-05T00:00:00.000Z",
   "contact": "987654321",
   "education": "Master",
   "address": "Jl. Jakarta No. 2",
   "position": "Sales Assistant",
   "salary": 3000000,
   "UserId": 3,
   "StoreId": 2,
   "createdAt": "2024-08-14T13:18:25.263Z",
   "updatedAt": "2024-08-14T13:18:25.263Z",
   "payrolls": [
   {
   "id": 1,
   "date": "2024-08-01T00:00:00.000Z",
   "amount": 2500000,
   "status": "PAID",
   "EmployeeId": 1,
   "createdAt": "2024-08-14T13:18:25.277Z",
   "updatedAt": "2024-08-14T13:18:25.277Z"
   }
   ],
   "attendances": [
   {
   "id": 2,
   "date": "2024-08-23T00:00:00.000Z",
   "status": "Absent",
   "EmployeeId": 1,
   "createdAt": "2024-08-14T13:18:25.270Z",
   "updatedAt": "2024-08-14T13:18:25.270Z"
   },
   {
   "id": 1,
   "date": "2024-08-22T00:00:00.000Z",
   "status": "Present",
   "EmployeeId": 1,
   "createdAt": "2024-08-14T13:18:25.270Z",
   "updatedAt": "2024-08-14T13:18:25.270Z"
   }
   ],
   "user": {
   "id": 3,
   "userName": "admin1",
   "email": "admin1@mail.com",
   "role": "ADMIN",
   "createdAt": "2024-08-14T13:18:24.602Z",
   "updatedAt": "2024-08-14T13:18:24.602Z"
   }
   }
   ]
   }
   ],
   "totalItems": 10,
   "totalPages": 1,
   "currentPage": 1
   }

2. POST api/stores/
   output :
   status 200 =
   {
   "message": "success",
   "data": {
   "id": 5,
   "name": "yuhaaa store",
   "location": "Jakarta",
   "category": "clothing",
   "OwnerId": 2,
   "updatedAt": "2024-08-15T00:16:02.723Z",
   "createdAt": "2024-08-15T00:16:02.723Z",
   "code": "OWSS-JKT-CL-24-08-15-07-2"
   }
   }

3. GET api/stores/:id
   output :
   status 200 =
   {
   "message": "success",
   "data": {
   "id": 1,
   "name": "Boss Electronic",
   "location": "Bali",
   "category": "Electronic",
   "code": "OWSS-BAL-EL-24-08-14-20-2",
   "OwnerId": 2,
   "createdAt": "2024-08-14T13:18:25.256Z",
   "updatedAt": "2024-08-14T13:18:25.256Z",
   "employees": [
   {
   "id": 3,
   "firstName": "John",
   "lastName": "Doe",
   "dateOfBirth": "1990-01-01T00:00:00.000Z",
   "contact": "123456789",
   "education": "Bachelor",
   "address": "Jl. Bali No. 1",
   "position": "Sales Admin",
   "salary": 5000000,
   "UserId": 5,
   "StoreId": 1,
   "createdAt": "2024-08-14T13:18:25.263Z",
   "updatedAt": "2024-08-14T13:18:25.263Z",
   "attendances": [
   {
   "id": 5,
   "date": "2024-08-22T00:00:00.000Z",
   "status": "Present",
   "EmployeeId": 3,
   "createdAt": "2024-08-14T13:18:25.270Z",
   "updatedAt": "2024-08-14T13:18:25.270Z"
   },
   {
   "id": 6,
   "date": "2024-08-23T00:00:00.000Z",
   "status": "Absent",
   "EmployeeId": 3,
   "createdAt": "2024-08-14T13:18:25.270Z",
   "updatedAt": "2024-08-14T13:18:25.270Z"
   }
   ],
   "payrolls": [
   {
   "id": 3,
   "date": "2024-08-01T00:00:00.000Z",
   "amount": 3000000,
   "status": "PAID",
   "EmployeeId": 3,
   "createdAt": "2024-08-14T13:18:25.277Z",
   "updatedAt": "2024-08-14T13:18:25.277Z"
   }
   ]
   },
   {
   "id": 4,
   "firstName": "Emily",
   "lastName": "Brown",
   "dateOfBirth": "1992-03-03T00:00:00.000Z",
   "contact": "7777777777",
   "education": "Bachelor",
   "address": "Jl. Bali No. 4",
   "position": "Cashier",
   "salary": 2500000,
   "UserId": 6,
   "StoreId": 1,
   "createdAt": "2024-08-14T13:18:25.263Z",
   "updatedAt": "2024-08-14T13:18:25.263Z",
   "attendances": [
   {
   "id": 7,
   "date": "2024-08-22T00:00:00.000Z",
   "status": "Present",
   "EmployeeId": 4,
   "createdAt": "2024-08-14T13:18:25.270Z",
   "updatedAt": "2024-08-14T13:18:25.270Z"
   },
   {
   "id": 8,
   "date": "2024-08-23T00:00:00.000Z",
   "status": "Absent",
   "EmployeeId": 4,
   "createdAt": "2024-08-14T13:18:25.270Z",
   "updatedAt": "2024-08-14T13:18:25.270Z"
   }
   ],
   "payrolls": [
   {
   "id": 4,
   "date": "2024-08-01T00:00:00.000Z",
   "amount": 2500000,
   "status": "PAID",
   "EmployeeId": 4,
   "createdAt": "2024-08-14T13:18:25.277Z",
   "updatedAt": "2024-08-14T13:18:25.277Z"
   }
   ]
   },
   {
   "id": 5,
   "firstName": "Luthfi",
   "lastName": "Jamil",
   "dateOfBirth": "1992-03-03T00:00:00.000Z",
   "contact": "7777777777",
   "education": "Bachelor",
   "address": "Jl. Bali No. 4",
   "position": "Cashier",
   "salary": 2500000,
   "UserId": 7,
   "StoreId": 1,
   "createdAt": "2024-08-14T13:18:25.263Z",
   "updatedAt": "2024-08-14T13:18:25.263Z",
   "attendances": [
   {
   "id": 9,
   "date": "2024-08-22T00:00:00.000Z",
   "status": "Present",
   "EmployeeId": 5,
   "createdAt": "2024-08-14T13:18:25.270Z",
   "updatedAt": "2024-08-14T13:18:25.270Z"
   },
   {
   "id": 10,
   "date": "2024-08-23T00:00:00.000Z",
   "status": "Absent",
   "EmployeeId": 5,
   "createdAt": "2024-08-14T13:18:25.270Z",
   "updatedAt": "2024-08-14T13:18:25.270Z"
   }
   ],
   "payrolls": [
   {
   "id": 5,
   "date": "2024-08-01T00:00:00.000Z",
   "amount": 2500000,
   "status": "PAID",
   "EmployeeId": 5,
   "createdAt": "2024-08-14T13:18:25.277Z",
   "updatedAt": "2024-08-14T13:18:25.277Z"
   }
   ]
   }
   ]
   }
   }

4. DELETE api/stores/:id
   output :
   status 200 =
   {
   "message": "Store and related Users deleted successfully"
   }
