import React from "react";

function Form({onSubmit, ...props}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    }
    return (
        <form onSubmit={handleSubmit}>
            {props.children}
        </form>
    );
}

export default Form;