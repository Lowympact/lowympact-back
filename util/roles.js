exports.can = function(req, user, action) {
    let hasRight = false;
    try {
        if(user){
            if(user.status === "admin"){ //admin can do everything
                hasRight = true; 
            }
            if(user.status === "user") { //simple user can't do anything for now
                hasRight = false;
            }
        }
    } catch (error) {
          hasRight = false;
    }
    return hasRight;
}