const mockUserData = {
    username: 'testuser',
    password: 'password123',
};

export const mockLogin = (username, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (
                username === mockUserData.username &&
                password === mockUserData.password
            ) {
                console.log(username,13);
                
                resolve({ username });
            } else {
                reject(new Error('Invalid username or password'));
            }
        }, 1000);
    });
};
