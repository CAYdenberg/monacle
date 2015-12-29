/** @jsx React.DOM */


  // //get React classes and bind them to their stores
  // var Folders = require('./components/Folders.js')(folderStore, userStore);
  // var AlertArea = require('./components/AlertArea.js')();
  // var AccountArea = require('./components/AccountArea.js')(userStore);
  // var SigninForm = require('./components/SigninForm.js')(userStore);
  // var SignupForm = require('./components/SignupForm.js')(userStore);
  //
  // //Render React classes
  // React.render(<AccountArea />, document.getElementById('account-area'));
  // React.render(<AlertArea />, document.getElementById('alert-area'));
  // React.render(<SigninForm />, document.getElementById('signin-form-wrapper'));
  // React.render(<SignupForm />, document.getElementById('signup-form-wrapper'));
  // React.render(<Folders />, document.getElementById('folders'));



  // var CitationList = require('./components/CitationList.js')(citationStore, folderStore);
  // React.render(<CitationList />, document.getElementById('citations'));

  // utils.emitter.on('USER_CHANGE', function() {
  //   utils.dispatcher.dispatch({ type: 'GET_FOLDERS' });
  // });
  //
  // //Register non-React stuff.
  //
  // //Convenient event to close all the modals
  // utils.emitter.on('CLOSE_MODALS', function() {
  //   $('.modal').modal('hide');
  // });

var React = require('react');
var utils = require('./utils');

//create stores
var folderStore = require('./stores/folderStore.js'),
  userStore = require('./stores/userStore.js'),
  searchCitationStore = require('./stores/citationStore/searchCitationStore'),
  savedCitationStore = require('./stores/citationStore/savedCitationStore');

var CitationList = require('./components/CitationList');

(function($) {

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var Monocle = {
    // All pages
    'common': {
      init: function() {
        utils.dispatcher.dispatch({type: 'GET_FOLDERS'});
      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
      }
    },

    'search': {
      init: function() {
        React.render(<CitationList citationStore={searchCitationStore} folderStore={folderStore} />, document.getElementById('citations'));
        //Send search query off to the dispatcher
        utils.dispatcher.dispatch({
          type: 'NEW_SEARCH',
          content: {queryString: globals.query}
        });
        //set the search box contents to the query string
        $('input[name=query]').val(globals.query);
      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS
      }
    },

    'saved': {
      init: function() {
        utils.dispatcher.dispatch({
          type: 'GET_FOLDER_CONTENTS',
          content: {folder: globals.currentFolder}
        });
      }
    }
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function(func, funcname, args) {
      var fire;
      var namespace = Monocle;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
