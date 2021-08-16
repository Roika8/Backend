const userService = require('../Services/usersService');

// describe('getUsers', () => {
//     it('Should return all users', () => {
//         const result=userService.getUsers();
//         expect(result).toHaveProperty('userName','firstName','lastName','status','gender')
//     })
// })

// describe('getUsers', () => {
//     it('Should return all users', () => {
//         const result = userService.getUsers();
//         expect(result).toHaveProperty('userName', 'firstName', 'lastName', 'status', 'gender')
//     })
// })

describe('getUserByID', () => {
    it('Should return user by ID',async () => {
        const result =await userService.getUserByID('61094fa991f355327c6b9703');
        console.log(result);
        expect(result).toEqual({
            _id: "61094fa991f355327c6b9703",
            userName: "roika10",
            firstName: "Ro",
            lastName: "SHlaev",
            password: "$2b$10$kmY.Y1JWRBZwutA3rSNDpu8gjBH01jTeybJqZesp79h4nUmNBfVOK",
            email: "orig@gmail.com",
            gender: 1,
            status: true,
            __v: 0
        })
    })
})