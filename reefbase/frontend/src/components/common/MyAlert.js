import React, { Component, Fragment } from "react";

const MyAlert = (props) => {
  return (
    <div className="alert">
      <span>
        {props.type == "alert" && (
          <Fragment>
            <div className="alert-title">{props.title}</div>
            <div className="alert-message">{props.message}</div>
          </Fragment>
        )}
        {props.type == "error" && (
          <Fragment>
            <div className="error-alert-title">Wystąpił błąd</div>
            <div className="error-alert-message">{props.message}</div>
          </Fragment>
        )}
      </span>
      <button
        className="btn-dismiss"
        onClick={() => {
          props.dismiss();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="18px"
          height="18px"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            fill="currentColor"
            d="M4.22676 4.22676C4.5291 3.92441 5.01929 3.92441 5.32163 4.22676L12 10.9051L18.6784 4.22676C18.9807 3.92441 19.4709 3.92441 19.7732 4.22676C20.0756 4.5291 20.0756 5.01929 19.7732 5.32163L13.0949 12L19.7732 18.6784C20.0756 18.9807 20.0756 19.4709 19.7732 19.7732C19.4709 20.0756 18.9807 20.0756 18.6784 19.7732L12 13.0949L5.32163 19.7732C5.01929 20.0756 4.5291 20.0756 4.22676 19.7732C3.92441 19.4709 3.92441 18.9807 4.22676 18.6784L10.9051 12L4.22676 5.32163C3.92441 5.01929 3.92441 4.5291 4.22676 4.22676Z"
          />
        </svg>
      </button>
    </div>
  );
};

export default MyAlert;
