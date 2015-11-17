'use strict'

import '../../adaptors/server/svg4everybody';
import React from 'react';
import Meta from "react-helmet";
import TransitionManager from 'react-transition-manager';
import classnames from 'classnames';
import get from 'lodash/object/get';
import find from 'lodash/collection/find';

// TODO: see if there's a better way to get fonts in
import '../../adaptors/server/localfont';

import window from '../../adaptors/server/window';
import '../../lib/animate';

import Store from '../../flux/store';
import Nulls from '../../flux/nulls';
import PageContainer from '../page-container';
import Navigation from '../navigation';
import Footer from '../footer';
import Modal from '../modal';
import EntranceTransition from '../entrance-transition';
import ContactTray from '../contact-tray';
import TakeOver from '../take-over';
import FourOhFour from '../404';
import BlogCategories from '../blog-categories';
import NavigationOverlay from '../navigation-overlay';
import PageLoader from '../page-loader';

const pageMap = {
  'home': require('../home'),
  'what-we-do': require('../what-we-do'),
  'what-we-do/case-study': require('../case-study'),
  'blog': require('../blog'),
  'blog/post': require('../post'),
  'blog/search-results': require('../search-results'),
  'legal': require('../legal'),
  'join-us': require('../join-us')
};

const App = React.createClass({
  getInitialState() {
    return this.props.state;
  },
  componentDidMount() {
    Store.on('change', this.onChangeStore);
  },
  componentWillUnmount() {
    Store.removeListener('change', this.onChangeStore);
  },
  onChangeStore(state) {
    this.setState(state);
  },
  showTakeover() {
    const { currentPage, takeover } = this.state;
    return currentPage === 'home' && takeover && !takeover.seen;
  },
  renderModal() {
    const { takeover, modal: modalType } = this.state;
    let modal;
    if (this.showTakeover()) {
      modal = <TakeOver key="takeover" takeover={takeover} />;
    } else if (modalType) {
      let content;
      let className;
      switch(modalType) {
        case 'navigation':
          className = 'navigation';
          content = <NavigationOverlay
            pages={this.state.navMain}
            section={this.state.currentPage.split('/')[0]}
          />;
          break;
        case 'contacts':
          className = 'tray';
          content = <ContactTray contacts={state.footer.contacts} />;
          break;
        case 'blogCategories':
          className = 'modal-blog-categories';
          content = <BlogCategories />;
          break;
      }
      modal = <Modal key={modalType} className={className}>{content}</Modal>;
    }
    return modal;
  },
  render() {
    const state = this.state;
    const appClasses = classnames('app', {
      'app-404': state.currentPage === 'notfound'
    });
    const contentClasses = classnames('app-content', {
      'takeover': this.showTakeover(),
      'disabled': !!state.modal,
      'mobile-no-scroll': state.modal || this.showTakeover()
    });
    let content;
    if (state.currentPage === 'notfound') {
      content = <div className={appClasses}>
        <Navigation
          pages={state.navMain}
          section={state.currentPage.split('/')[0]}
          page={state.currentPage.split('/')[1]}
          takeover={this.showTakeover()}
        />
        <FourOhFour {...this.state} />
      </div>;
    } else {
      content = <div className={appClasses}>
        <Meta
          title={get(state, 'page.seo.title') || ''}
          meta={[{
            name: "description",
            content: get(state, 'page.seo.desc') || ''
          }, {
            name: "keywords",
            content: get(state, 'page.seo.keywords') || ''
          }, {
            name: "og:type",
            content: 'website'
          }, {
            name: "og:title",
            content: get(state, 'page.seo.title') || ''
          }, {
            name: "og:description",
            content: get(state, 'page.seo.desc') || ''
          }, {
            name: "og:image",
            content: get(state, 'page.seo.image') || ''
          }]}
        />
        <EntranceTransition className="nav-wrapper">
          <Navigation
            pages={state.navMain}
            section={state.currentPage.split('/')[0]}
            page={state.currentPage.split('/')[1]}
            takeover={this.showTakeover()}
          />
        </EntranceTransition>
        <PageContainer key={state.currentPage} className={contentClasses}>
          <TransitionManager
            component="div"
            className="page-loader-container"
            duration={700}
          >
            {this.getPage(state.currentPage)}
          </TransitionManager>
          <Footer data={state.footer} studios={state.studios} />
        </PageContainer>
        <TransitionManager
          component="div"
          className="app__modal"
          duration={500}
        >
          {this.renderModal()}
        </TransitionManager>
      </div>;
    }
    return content;
  },
  getPage(pageId) {
    const { currentPage, page: pageData, post, caseStudy} = this.state;
    let page;
    if(currentPage !== 'legal' && currentPage !== 'blog/search-results' && !pageData && !post && !caseStudy) {
      page = <PageLoader key="loader" className={`loading-${pageId}`} />;
    } else {
      page = React.createElement(pageMap[pageId], Object.assign({ key: `page-${pageId}` }, this.state));
    }
    return page;
  }
});

export default App;
