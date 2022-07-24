import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const Header = () => {
  return (
    <Router>
      <div className="navbar bg-base-100 rounded-lg mb-1 bg-primary ">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">
            Los Pollos Hermanos
          </a>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search..."
              // onChange={event => { this.setQuery({ query: event.target.value }) }}
              // onKeyPress={event => {
              //   if (event.key === 'Enter') {
              //     this.search()
              //   }
              // }
              // }
            />
          </div>

          <Link to="/auth">
            <button className="btn btn-ghost"> Authorize </button>
          </Link>

          <a>
            <button className="btn btn-ghost"> Logout</button>
          </a>

          <div className="dropdown dropdown-end">
            <label className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="https://placeimg.com/80/80/people" />
              </div>
            </label>
            <ul className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <a className="justify-between">
                  Profile
                  {/* <span className="badge">New</span> */}
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default Header;
