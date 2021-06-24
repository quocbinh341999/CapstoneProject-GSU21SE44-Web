const resource = 'Accounts';
class AuthRepository{
    constructor(requestInstance) {
        this.req = requestInstance;
      }
    login=(idToken)=>this.req.post(`${resource}/Authenticate`,{idToken});
}
export default AuthRepository;