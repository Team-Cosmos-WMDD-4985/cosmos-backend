export default {
    validateBodyAsync :async (joiObject , data)=> {
        const  { error, value } = await joiObject.validateAsync(data);
        if(error){
            const message = error.details[0].message;
            throw new Error(message)
        }
        return {success : true, error, message : null}
    },
}