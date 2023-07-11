import React from "react";

const ToastError = ({ messge }) => {
  return (
    <div className="toast toast-top toast-center">
      <div className="font-semibold text-white alert alert-error">
        <span>{messge}</span>
      </div>
    </div>
  );
};

export default ToastError;
