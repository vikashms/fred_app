/**
 * Created by vikashs on 28-01-2016.
 */
var Utills = {};

Utills = {
    Date:{
        getStartEnd:function(n1,n2){
            var startDate = new Date();
            var endDate = new Date();
            startDate.setDate(n1);
            endDate.setDate(n2);
            return {
                start:startDate,
                end:endDate
            }
        }
    }
}

module.exports = Utills;