module.exports = {
    success: function (req) {
        let response = {}
        response.status = 'success';
        response.success  = true;
        req.tokendata ? response.tokendata = req.tokendata : '';
        req.payload ? response.payload = req.payload : '';
        req.msg ? response.msg = req.msg : '';
        return response;
    },
    error: function (req, res) {
        let response = {}
        response.success  = false;
        response.status = 'fail';
        req.msg ? response.msg = req.msg : '';
        return response;
    }
}