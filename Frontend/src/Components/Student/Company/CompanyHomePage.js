import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Modal from 'react-modal';
import { BeatLoader } from 'react-spinners';
import CompanyOverview from './CompanyOverview';
import CompanyReviews from './CompanyReviews';
import CompanyJobs from './CompanyJobs';
import CompanySalaries from './CompanySalaries';
import CompanyInterviews from './CompanyInterviews';
import CompanyPhotos from './CompanyPhotos';

Modal.setAppElement('#root');
class CompanyHomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overallRate: Number,
      recommendedRating: Number,
      ceoRating: Number,
      firstReview: [],
      secondReview: [],
      reviews: [],
      company: {},
      cphotos: [],
      salaries: null,
      interviews: null,
      jobs: null,
      tab: 'Overview',
      loading: true
    };
  }

  componentDidMount() {
    let url = `${process.env.REACT_APP_BACKEND}/companies/specificCompany`;
    const { cid } = this.props;
    const Promises = [];
    // OVERVIEW
    Promises.push(axios.post(url, { cid })
      .then((response) => {
        if (response.data) {
          const company = response.data;
          this.setState({ company, cphotos: company.cphotos });
        }
      }));
    url = `${process.env.REACT_APP_BACKEND}/reviews/cid`;

    // REVIEWS API
    Promises.push(axios.post(url, { cid })
      .then((response) => {
        if (response.data && response.data.length > 0) {
          console.log(response.data);
          const reviews = response.data;
          let average = 0;
          let recommended = 0;
          let approve = 0;
          const arr = [];
          console.log(response.data);
          for (let i = 0; i < response.data.length; i++) {
            average += response.data[i].overallRating;
            if (response.data[i].rrecommended === 'Yes') {
              recommended++;
            }
            if (response.data[i].rceoapprove === 'Yes') {
              approve++;
            }
          }
          recommended /= response.data.length;
          recommended *= 100;
          recommended = Math.round(recommended);
          average /= response.data.length;
          average = average.toFixed(1);
          approve /= response.data.length;
          approve *= 100;
          approve = Math.round(approve);
          reviews.sort((a, b) => b.rhelpful - a.rhelpful);
          let isPos = false;
          let isNeg = false;
          for (let i = 0; i < reviews.length; i++) {
            if (reviews[i].routlook === 'Positive' && !isPos) {
              arr.push(reviews[i]);
              isPos = true;
            }

            if (reviews[i].routlook === 'Negative' && !isNeg) {
              arr.push(reviews[i]);
              isNeg = true;
            }

            if (isNeg && isPos) {
              break;
            }
          }
          arr.push(response.data[0]);
          arr.push(response.data[1]);
          console.log(arr);
          this.setState({
            overallRate: average,
            recommendedRating: recommended,
            ceoRating: approve,
            firstReview: arr[0],
            secondReview: arr[1],
            reviews: response.data
          });
        }
      }));

    Promise.all(Promises).then(() => this.setState({ loading: false }));
  }

  tabChangeHandler = (e) => {
    this.setState({
      tab: e.currentTarget.getAttribute('data-label')
    });
  }

  updatePhotos = (cphotos) => {
    this.setState({ cphotos });
  }

  updateReviews = (reviews) => {
    this.setState({ reviews });
  }

  updateJobs = (jobs) => {
    this.setState({ jobs });
  }

  updateSalaries = (salaries) => {
    this.setState({ salaries });
  }

  updateInterviews = (interviews) => {
    this.setState({ interviews });
  }

  render() {
    const { company, tab, cphotos, overallRate, recommendedRating, ceoRating, firstReview, secondReview, reviews, jobs, salaries, interviews, loading } = this.state;
    console.log(tab);
    let companyContent = null;
    switch (tab) {
      case 'Overview':
        companyContent = <CompanyOverview company={company} cname={company.cname} cid={company._id} stname={this.props.name} stid={this.props.id} overallRate={overallRate} recommendedRating={recommendedRating} ceoRating={ceoRating} firstReview={firstReview} secondReview={secondReview} reviews={reviews} />;
        break;
      case 'Reviews':
        companyContent = <CompanyReviews cname={company.cname} cid={company._id} stname={this.props.name} stid={this.props.id} updateReviews={this.updateReviews} />;
        break;
      case 'Jobs':
        companyContent = <CompanyJobs updateJobs={this.updateJobs} jobs={jobs} cname={company.cname} isAuth={this.props.isAuth} />;
        break;
      case 'Salaries':
        companyContent = <CompanySalaries updateSalaries={this.updateSalaries} salaries={salaries} stid={this.props.id} cname={company.cname} cid={company._id} isAuth={this.props.isAuth} />;
        break;
      case 'Interview':
        companyContent = <CompanyInterviews updateInterviews={this.updateInterviews} interviews={interviews} stid={this.props.id} cname={company.cname} isAuth={this.props.isAuth} />;
        break;
      case 'Photos':
        companyContent = <CompanyPhotos updatePhotos={this.updatePhotos} cphotos={cphotos} stid={this.props.id} stname={this.props.name} cid={company._id} cname={company.cname} isAuth={this.props.isAuth} />;
        break;
      default:
        console.log('D');
        companyContent = null;
    }
    return loading ? <div className="loader"><BeatLoader color="green" /></div> : (
      <div>
        <div id="EIHdrModule" className="snug module noblur eep sticky" style={{ width: '992px', top: '1px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div id="EmpHeroAndEmpInfo" className="gdGrid" data-brandviews="MODULE:n=hub-profileImage:eid=432">
            <div id="HeroLbFrame-432" className="hidden">
              <div className="lbSlideFrame">
                <div className="titleBar">
                  <span className="viewAll">
                    <a href="/Photos/McDonald-s-Office-Photos-E432.htm">
                      <i />
                      <span>View All</span>
                    </a>
                  </span>
                  <span className="counter">
                    <span className="current">num</span>
                    {' '}
                    of
                    {' '}
                    <span className="total">num</span>
                  </span>
                  <span className="close"><button type="button" title="Close (Esc)"><span className="offScreen">Close (Esc)</span></button></span>
                </div>
                <div className="slides" />
              </div>
            </div>
            <div className="empInfo tbl hideHH ">
              <div className="logo cell"><a href="/Overview/Working-at-McDonald-s-EI_IE432.11,21.htm" data-ajax="true" className="sqLogoLink"><span className="sqLogo tighten lgSqLogo logoOverlay" style={{ position: 'relative', top: '20px', right: '17px' }}><img src={company.cphoto} className alt=" Logo" title /></span></a></div>
              <div className="header cell info" style= {{ position: 'relative', right: '250px' }}>
                <h1 className=" strong tightAll" title data-company="McDonald's">
                  <span id="DivisionsDropdownComponent" className="d-inline-flex align-items-center">
                    <p style={{ fontSize: '20px' }}>{ company.cname }</p>
                  </span>
                </h1>
              </div>
              <div className="cell unlock small showDesk" />
            </div>
          </div>
          <div id="StickyNavWrapper" className="stickyNavWrapper ">
            <div id="SmarterNavContainer" className="initialStick">
              <div id="SmarterBannerContainer" />
              <div id="EmpLinksWrapper" className="empLinksWrapper  sticky">
                <div className="empLinks tbl ">
                  <div id="EIProductHeaders" className="tbl eiProductCells">
                    <div className="row ">
                      <a className="eiCell cell reviews " onClick={this.tabChangeHandler} data-label="Overview">
                        <span className="subtle"> Overview</span>
                      </a>
                      <div className="vline cell"><i /></div>
                      <a className="eiCell cell reviews " onClick={this.tabChangeHandler} data-label="Reviews">
                        <span className="num h2"> 43k</span>
                        <span className="subtle"> Reviews</span>
                      </a>
                      <div className="vline cell"><i /></div>
                      <a className="eiCell cell jobs " onClick={this.tabChangeHandler} data-label="Jobs">
                        <span className="num h2"> 56k</span>
                        <span className="subtle"> Jobs</span>
                      </a>
                      <div className="vline cell"><i /></div>
                      <a className="eiCell cell salaries " onClick={this.tabChangeHandler} data-label="Salaries">
                        <span className="num h2"> 40k</span>
                        <span className="subtle"> Salaries</span>
                      </a>
                      <div className="vline cell"><i /></div>
                      <a className="eiCell cell interviews " onClick={this.tabChangeHandler} data-label="Interview">
                        <span className="num h2"> 7.3k</span>
                        <span className="subtle"> Inter­views</span>
                      </a>
                      <div className="vline cell"><i /></div>
                      <div className="vline cell"><i /></div>
                      <a className="eiCell cell photos " onClick={this.tabChangeHandler} data-label="Photos">
                        <span className="num h2"> 291</span>
                        <span className="subtle"> Photos</span>
                      </a>
                    </div>
                  </div>
                  <div className="buttons cell showDesk padRt alignRt">
                    <div id="EIHeaderFollowButton" style={{ display: 'inline-block', marginRight: '12px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {companyContent}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cname: state.student.cname,
    cid: state.student.cid,
    id: state.student.id,
    name: state.credentials.isAuth ? state.student.user.stname : '',
    isAuth: state.credentials.isAuth
  };
};

export default connect(mapStateToProps)(CompanyHomePage);
