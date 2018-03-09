import React from "react";
import PropTypes from "prop-types";
import * as _ from "lodash";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const styles = {
  link: {
    cursor: "pointer"
  }
};
/*
const propTypes = {
  items: PropTypes.array.isRequired,
  onChangePage: PropTypes.func.isRequired,
  initialPage: PropTypes.number
};
*/

const defaultProps = {
  initialPage: 1
};

class HVSPagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pager: {
        pageSize: this.props.pageSize || 10
      }
    };
  }

  componentWillMount() {
    //debugger;
    // set page if items array isn't empty
    if (this.props.items && this.props.items.length) {
      this.setPage(this.props.initialPage);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    //debugger;

    // reset page if items array has changed
    if (
      this.props.items !== prevProps.items ||
      this.props.filterValue != prevProps.filterValue ||
      this.props.pageSize != prevProps.pageSize
    ) {
      //if (this.props.items.length > 0) {
      // default page size is 10
      //const pageSize = this.state.pager.pageSize || 10;
      const pageSize = this.props.pageSize || 10;

      let items;

      let keys = Object.keys(this.props.filterValue);
      let filter = Object.values(this.props.filterValue);

      if (keys.length > 0) {

        items = this.props.items.filter(
          function(item) {
            for (var i = 0; i < filter.length; i++) {
              if (item[keys[i]].toLowerCase().indexOf(filter[i].value) == -1) {
                ////debugger;
                return false;
              }
            }
            ////debugger;
            return true;
          }
        ); 
        /*
        items = this.props.items.map((itm) => {
         return keys.map((key) => {
            console.log("Key:" + key)
            console.log("value:" + this.props.filterValue[key].value)
            console.log("Item value:" + itm[key])
  
            if (this.props.filterValue[key] && _.trim(this.props.filterValue[key].value) != "") {
              if(itm[key].toLowerCase().indexOf(_.trim(this.props.filterValue[key].value)) != -1){
                return itm;
              }
            }
          })         
        })
        */
      } else {
        items = this.props.items;
      }
      /*
      if (this.props.filterValue.trim() != "") {
        items = _.filter(this.props.items, item => {
          return (
            item[this.props.searchCol]
              .toLowerCase()
              .indexOf(this.props.filterValue) !== -1
          );
        });
      } else {
        items = this.props.items;
      }
      */

      //debugger;

      // calculate total pages
      const totalPages = Math.ceil((items ? items.length : 0) / pageSize);

      if (this.state.pager.currentPage <= totalPages) {
        this.setPage(this.state.pager.currentPage);
      } else {
        this.setPage(this.props.initialPage);
      }
      /*
      if (!this.state.pager.currentPage && this.props.items.length) {
        this.setPage(this.props.initialPage);
      } else {
        //this.setPage(this.state.pager.currentPage);
      }
      */
    }
  }

  setPage(page) {
    //debugger;

    let items;
    //alert(this.props.items)
    let keys = Object.keys(this.props.filterValue);
    let filter = Object.values(this.props.filterValue);

    if (keys.length > 0) {

      items = this.props.items.filter(
        function(item) {
          for (var i = 0; i < filter.length; i++) {
            if (item[keys[i]].toLowerCase().indexOf(filter[i].value) == -1) {
              ////debugger;
              return false;
            }
          }
          ////debugger;
          return true;
        }
      ); 
      /*
      items = this.props.items.map((itm) => {
       return keys.map((key) => {
          console.log("Key:" + key)
          console.log("value:" + this.props.filterValue[key].value)
          console.log("Item value:" + itm[key])
          if (this.props.filterValue[key] && _.trim(this.props.filterValue[key].value) != "") {
            if(itm[key].toLowerCase().indexOf(_.trim(this.props.filterValue[key].value)) != -1){
              return itm;
            }
          }
        })         
      })
      */
    } else {
      items = this.props.items;
    }
    /*
    if (this.props.filterValue.trim() != "") {
      items = _.filter(this.props.items, item => {
        return (
          item[this.props.searchCol]
            .toLowerCase()
            .indexOf(this.props.filterValue) !== -1
        );
      });
    } else {
      items = this.props.items;
    }
*/

    if (!items || typeof (items) == "undefined") {
      items = [];
    }
    let pager = this.state.pager;

    /*
    if (page < 1 || page > pager.totalPages) {
      return;
    }
    */
    //console.log(items)
    //alert(items.length)
    // get new pager object for specified page
    pager = this.getPager(items.length, page);

    // get new page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    // update state
    this.setState({ pager: pager });

    // call change page function in parent component
    this.props.onChangePage(pageOfItems);
  }

  getPager(totalItems, currentPage, pageSize) {
    //debugger;
    // default to first page
    currentPage = currentPage || 1;

    // default page size is 10
    //pageSize = pageSize || 10;
    pageSize = this.props.pageSize || 10;

    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    let startPage, endPage;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    const pages = _.range(startPage, endPage + 1);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  render() {
    const pager = this.state.pager;

    if (!pager.pages || pager.pages.length <= 1) {
      // don't display pager if there is only 1 page
      return null;
    }

    return (
      <Pagination size="md" className="p-0 m-0">
        <PaginationItem
          style={styles.link}
          className={pager.currentPage === 1 ? "disabled" : ""}
        >
          <PaginationLink onClick={() => this.setPage(1)}>
            {""}
            <i className="fa fa-fast-backward fa-fw" />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem
          style={styles.link}
          className={pager.currentPage === 1 ? "disabled" : ""}
        >
          <PaginationLink onClick={() => this.setPage(pager.currentPage - 1)}>
            {""}
            <i className="fa fa-step-backward fa-fw" />
          </PaginationLink>
        </PaginationItem>
        {pager.pages.map((page, index) => (
          <PaginationItem
            style={styles.link}
            key={index}
            className={pager.currentPage === page ? "active" : ""}
          >
            <PaginationLink onClick={() => this.setPage(page)}>
              {""}
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem
          style={styles.link}
          className={pager.currentPage === pager.totalPages ? "disabled" : ""}
        >
          <PaginationLink onClick={() => this.setPage(pager.currentPage + 1)}>
            {""}
            <i className="fa fa-step-forward fa-fw" />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem
          style={styles.link}
          className={pager.currentPage === pager.totalPages ? "disabled" : ""}
        >
          <PaginationLink onClick={() => this.setPage(pager.totalPages)}>
            {""}
            <i className="fa fa-fast-forward fa-fw" />
          </PaginationLink>
        </PaginationItem>
      </Pagination>
    );
  }
}

//agination.propTypes = propTypes;
//Pagination.defaultProps
export default HVSPagination;