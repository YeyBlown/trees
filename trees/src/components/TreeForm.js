import React from "react";

const TreeForm = () => {
  return (
      <form method="post" action="/" id="form" class="validate">
        <div class="form-field">
          <label for="full-name">Full Name</label>
          <input
            type="text"
            name="full-name"
            id="full-name"
            placeholder="Joe Bloggs"
            required
          />
        </div>
        <div class="form-field">
          <label for="email-input">Email</label>
          <input
            type="email"
            name="email-input"
            id="email-input"
            placeholder="example@domain.com"
            required
          />
        </div>
        <div class="form-field">
          <label for="password-input">Password</label>
          <input
            type="password"
            name="password-input"
            id="password-input"
            required
          />
        </div>
        <div class="form-field">
          <label for=""></label>
          <input type="submit" value="Sign Up" />
        </div>
      </form>
  );
};

export default TreeForm;
