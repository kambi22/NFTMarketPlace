const Authentication = async () => {
    try {
        const options = { method: 'GET', headers: { Authorization: 'Bearer <token>' } };

        fetch('https://api.pinata.cloud/data/testAuthentication', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
    } catch (error) {
        console.error("error",error)
    }
}