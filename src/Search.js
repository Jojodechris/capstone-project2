// Search.js

import React, { Component } from "react";


class Search extends Component {
  render() {
    return (
      <div className="sideG">
        <form onSubmit={this.props.search} action="">
          <input
            onChange={this.props.handleSearch}
            type="text"
            name="search"
            placeholder="Search for a book...🔍"
          />
          <button type="submit">Search</button>
          <select defaultValue="sort" onChange={this.props.handleSort}>
            <option value="sort">Sort</option>
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
           </select> 
        </form>
      </div>
    );
  }
}

  export default Search;