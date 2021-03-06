import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { getCid } from '../../Actions/studentActions';
import Pagination from '../Pagination';

class CompanySearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companies: [],
      loading: true,
      pageIndex: 0,
      numPages: 0,
      numCompanies: 0
    };
    this.itemsPerPage = 10;
  }

  componentDidMount() {
    const { searchQuery } = this.props;
    console.log('searchQuery: ', searchQuery);
    const cname = searchQuery;

    const Promises = [];
    let url = `${process.env.REACT_APP_BACKEND}/search/companies`;
    Promises.push(axios.post(url, { cname })
      .then((response) => {
        if (response.data) {
          this.setState({
            companies: response.data
          });
        }
      }));

    url = `${process.env.REACT_APP_BACKEND}/search/companies/numPages`;
    Promises.push(axios.post(url, { cname })
      .then((response) => {
        if (response.data) {
          const { numCompanies } = response.data;
          this.setState({
            numCompanies, numPages: Math.ceil(numCompanies / this.itemsPerPage)
          });
        }
      }));
    Promise.all(Promises).then(() => this.setState({ loading: false }));
  }

  setPage = (e) => {
    this.setState({
      loading: true
    });
    const { className } = e.currentTarget;
    const { numPages } = this.state;
    let { pageIndex } = this.state;
    if (className === 'prev' && pageIndex > 0) {
      pageIndex -= 1;
    } else if (className === 'next' && pageIndex < numPages - 1) {
      pageIndex += 1;
    } else if (className.includes('page')) {
      pageIndex = parseInt(e.currentTarget.getAttribute('pageIndex'));
    }
    const url = `${process.env.REACT_APP_BACKEND}/search/companies`;
    axios.post(url, { cname: this.props.searchQuery, skip: pageIndex })
      .then((response) => {
        if (response.data) {
          this.setState({
            companies: response.data, pageIndex, loading: false
          });
        }
      });
  }

  render() {
    // const { companies } = this.state;
    // const { credentials } = this.props;
    const { companies, loading, pageIndex, numCompanies, numPages } = this.state;
    const { itemsPerPage } = this;
    const { credentials } = this.props;
    let numItems = 0;
    if (numCompanies > 0) numItems = numPages === pageIndex + 1 && numCompanies % itemsPerPage !== 0 ? numCompanies % itemsPerPage : itemsPerPage;
    const contents = companies.map((item) => (
      <div className="single-company-result module ">
        <div className="row justify-content-between">
          <div className="col-lg-7">
            <div className="row justify-content-start">
              <div className="col-3 logo-and-ratings-wrap">
                <img className="img-responsive img-thumbnail" src={item.cphoto} alt="reviewPic" width="300" />
              </div>
              <div className="col-9 pr-0">
                <h2>
                  <Link to={{
                    pathname: '/admin/company',
                    query: {
                      cid: `${item._id}`,
                    },
                  }}
                  >
                    {' '}
                    {item.cname}
                    {' '}
                  </Link>
                  <div>
                    <span>
                      <span className="bigRating strong margRtSm h2">{item.averageRating}</span>
                      <span className="gdStars gdRatings sm ">
                        <i>
                          <i />
                          <i className="star"><span>Star</span></i>
                        </i>
                      </span>
                    </span>
                  </div>
                </h2>
                <div>
                  <p className="hqInfo adr m-0">
                    <span>
                      {' '}
                      { item.clocation }
                    </span>
                  </p>
                  <p className="webInfo mb-0 mt-xxsm"><span><a href="www.mcdonalds.com">{ item.cwebsite }</a></span></p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 ei-contributions-count-wrap mt-std">
            <div className="row justify-content-between">
              <div className="ei-contribution-wrap col-4 pl-lg-0 pr-0">
                <a className="eiCell cell reviews d-inline-block py-sm" href="/Reviews/McDonald-s-San-Francisco-Reviews-EI_IE432.0,10_IL.11,24_IM759.htm">
                  <span className="num h2">
                    {' '}
                    { item.reviewCount }
                  </span>
                  <span className="subtle"> Reviews</span>
                </a>
              </div>
              <div className="ei-contribution-wrap col-4 p-0">
                <a className="eiCell cell salaries d-inline-block py-sm" href="/Salary/McDonald-s-San-Francisco-Salaries-EI_IE432.0,10_IL.11,24_IM759.htm">
                  <span className="num h2">
                    {' '}
                    { item.salaryCount }
                  </span>
                  <span className="subtle"> Salaries</span>
                </a>
              </div>
              <div className="ei-contribution-wrap col-4 pl-0">
                <a className="eiCell cell interviews d-inline-block py-sm" href="/Interview/McDonald-s-San-Francisco-Interview-Questions-EI_IE432.0,10_IL.11,24_IM759.htm">
                  <span className="num h2">
                    {' '}
                    { item.interviewCount }
                  </span>
                  <span className="subtle"> Inter­views</span>
                </a>
              </div>
              {/* <div className="col-12 mt">
                <div className="row justify-content-center justify-content-lg-end">
                  <div className="col-11 col-lg-auto cta-wrap">
                    <a href="/mz-survey/employer/collectReview_input.htm?c=PAGE_SRCH_COMPANIES&amp;i=432" className="gd-btn gd-btn-link gradient gd-btn-1 gd-btn-med gd-btn-icon pr-md">
                      <i className="btn-plus margRtSm" />
                      <span>Add a Review</span>
                      <i className="hlpr" />
                    </a>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    ));

    return loading ? <div className="loader"><BeatLoader color="green" /></div> : (
    /*
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <div className="flex-aside">
            <article>
              <div className="companySearchHierarchies gdGrid">
                <header className="px-lg-0 px">
                  <h1 className="pt-lg-std py-sm m-0">
                    {' '}
                    Showing results for
                    {' '}
                    <strong>{this.props.searchQuery}</strong>
                  </h1>
                  <div className="pb-lg-xxl pb-std">
                    {' '}
                    Showing
                    {' '}
                    <strong>1</strong>
                    –
                    <strong>5</strong>
                    {' '}
                    Companies
                  </div>
                </header>
                <div>
                  {contents}
                </div>
                <div className="module pt-xxsm">
                  <div id="FooterPageNav" className="pageNavBar tbl fill noMargBot">
                    <div className="pagingControls cell middle">
                      <ul>
                        <li className="prev"><span className="disabled"><i><span>Previous</span></i></span></li>
                        <li className="page current "><span className="disabled">1</span></li>
                        <li className="page "><a href="/Reviews/san-francisco-mcdonalds-reviews-SRCH_IL.0,13_IM759_KE14,23_IP2.htm">2</a></li>
                        <li className="page "><a href="/Reviews/san-francisco-mcdonalds-reviews-SRCH_IL.0,13_IM759_KE14,23_IP3.htm">3</a></li>
                        <li className="page "><a href="/Reviews/san-francisco-mcdonalds-reviews-SRCH_IL.0,13_IM759_KE14,23_IP4.htm">4</a></li>
                        <li className="page last"><a href="/Reviews/san-francisco-mcdonalds-reviews-SRCH_IL.0,13_IM759_KE14,23_IP5.htm">5</a></li>
                        <li className="next"><a href="/Reviews/san-francisco-mcdonalds-reviews-SRCH_IL.0,13_IM759_KE14,23_IP2.htm"><i><span>Next</span></i></a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            <aside id="ZCol" className="zCol" />
          </div>
        </div>
      </div>
      */

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <div className="flex-aside">
            <article>
              <div className="companySearchHierarchies gdGrid">
                <header className="px-lg-0 px">
                  <h1 className="pt-lg-std py-sm m-0">
                    {' '}
                    Showing results for
                    {' '}
                    <strong>{this.props.searchQuery}</strong>
                  </h1>
                  <div className="pb-lg-xxl pb-std">
                    {' '}
                    Showing
                    {' '}
                    <strong>{(itemsPerPage * pageIndex) + 1}</strong>
                    –
                    <strong>{(itemsPerPage * pageIndex) + numItems}</strong>
                    {' '}
                    of
                    {' '}
                    <strong>{numCompanies}</strong>
                    {' '}
                    Companies
                  </div>
                </header>
                <div>
                  {contents}
                </div>
                <Pagination setPage={this.setPage} page={pageIndex} numPages={numPages} />
              </div>
            </article>
            <aside id="ZCol" className="zCol" />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    searchQuery: state.student.searchQuery,
    credentials: state.credentials,
  };
};

const mapDisptachToProps = (dispatch) => {
  return {
    getCid: (cid) => dispatch(getCid(cid))
  };
};

export default connect(mapStateToProps, mapDisptachToProps)(CompanySearchResults);
