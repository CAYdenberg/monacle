var React = require('react');
var ReactDOM = require('react-dom');
var utils = require('./utils');

//create stores
var folderStore = require('./stores/folderStore.js'),
  userStore = require('./stores/userStore.js'),
  searchCitationStore = require('./stores/citationStore/searchCitationStore'),
  savedCitationStore = require('./stores/citationStore/savedCitationStore');

//get components
var CitationList = require('./components/CitationList');
var AccountArea = require('./components/AccountArea');
var SigninForm = require('./components/SigninForm');
var SignupForm = require('./components/SignupForm');
var Folders = require('./components/Folders');
var NotificationArea = require('./components/NotificationArea');



(function($) {

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var Monocle = {
    // All pages
    'common': {
      init: function() {

        userStore.onUpdate(function() {

          //close the sign-in and sign-up forms when the user changes
          $('.modal').modal('hide');

          //if a user is logged in, grab their folders
          if (userStore.loggedIn) {
            utils.dispatcher.dispatch({
              type: 'GET_FOLDERS'
            });
          }

        });

        //set the initial user store with the user email passed from the backend
        userStore.update(globals.user);

      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
      }
    },

    'app': {
      init: function() {
        //render the account-area, modals, and folders
        ReactDOM.render(<AccountArea store={userStore} />, document.getElementById('account-area'));
        ReactDOM.render(<SigninForm  store={userStore} />, document.getElementById('signin-form-wrapper'));
        ReactDOM.render(<SignupForm  store={userStore} />, document.getElementById('signup-form-wrapper'));
        ReactDOM.render(<Folders store={folderStore} userStore={userStore} />, document.getElementById('folders'));
        ReactDOM.render(<NotificationArea />, document.getElementById('alert-area'));
      }
    },

    'search': {
      init: function() {

        ReactDOM.render(<CitationList citationStore={searchCitationStore} folderStore={folderStore} />, document.getElementById('citations'));
        //Send search query off to the dispatcher
        utils.dispatcher.dispatch({
          type: 'NEW_SEARCH',
          content: {queryString: globals.query}
        });

        //set the search box contents to the query string
        $('input[name=query]').val(globals.query);

      }
    },

    'saved': {
      init: function() {
        folderStore.setCurrentFolder(globals.currentFolder);

        ReactDOM.render(<CitationList citationStore={savedCitationStore} folderStore={folderStore} />, document.getElementById('citations'));
        //grab folder contents
        utils.dispatcher.dispatch({
          type: 'GET_FOLDER_CONTENTS',
          content: {folder: globals.currentFolder}
        });

      }
    },

    'profile': {
      init: function() {
        $('.delete-folder').click(function() {
          var $element = $(this);
          var slug = $element.data('delete');
          $.ajax({
            method: "DELETE",
            url: "/folders/" + slug,
            success: function(res) {
              if (res) {
                $element.parents('li').remove();
              }
            }
          });
        });

      }
    }
  };

});
