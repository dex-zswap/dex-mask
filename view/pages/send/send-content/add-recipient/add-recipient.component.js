import React, { Component } from 'react';
import Fuse from 'fuse.js';
import PropTypes from 'prop-types';
import ContactList from '@c/app/contact-list';
import RecipientGroup from '@c/app/contact-list/recipient-group';
import Button from '@c/ui/button';
import Confusable from '@c/ui/confusable';
import Dialog from '@c/ui/dialog';
import Identicon from '@c/ui/identicon';
import { ellipsify } from '@pages/send/utils';
export default class AddRecipient extends Component {
  static propTypes = {
    userInput: PropTypes.string,
    ownedAccounts: PropTypes.array,
    addressBook: PropTypes.array,
    updateRecipient: PropTypes.func,
    ensResolution: PropTypes.string,
    ensError: PropTypes.string,
    ensWarning: PropTypes.string,
    addressBookEntryName: PropTypes.string,
    contacts: PropTypes.array,
    nonContacts: PropTypes.array,
    useMyAccountsForRecipientSearch: PropTypes.func,
    useContactListForRecipientSearch: PropTypes.func,
    isUsingMyAccountsForRecipientSearch: PropTypes.bool,
    recipient: PropTypes.shape({
      address: PropTypes.string,
      nickname: PropTypes.nickname,
      error: PropTypes.string,
      warning: PropTypes.string,
    }),
  };

  constructor(props) {
    super(props);
    this.recentFuse = new Fuse(props.nonContacts, {
      shouldSort: true,
      threshold: 0.45,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        {
          name: 'address',
          weight: 0.5,
        },
      ],
    });
    this.contactFuse = new Fuse(props.contacts, {
      shouldSort: true,
      threshold: 0.45,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        {
          name: 'name',
          weight: 0.5,
        },
        {
          name: 'address',
          weight: 0.5,
        },
      ],
    });
  }

  static contextTypes = {
    t: PropTypes.func,
  };
  selectRecipient = (address, nickname = '') => {
    this.props.updateRecipient({
      address,
      nickname,
    });
  };
  searchForContacts = () => {
    const { userInput, contacts } = this.props;
    let _contacts = contacts;

    if (userInput) {
      this.contactFuse.setCollection(contacts);
      _contacts = this.contactFuse.search(userInput);
    }

    return _contacts;
  };
  searchForRecents = () => {
    const { userInput, nonContacts } = this.props;
    let _nonContacts = nonContacts;

    if (userInput) {
      this.recentFuse.setCollection(nonContacts);
      _nonContacts = this.recentFuse.search(userInput);
    }

    return _nonContacts;
  };

  render() {
    const {
      ensResolution,
      recipient,
      userInput,
      addressBookEntryName,
      isUsingMyAccountsForRecipientSearch,
    } = this.props;
    let content;

    if (recipient.address) {
      content = this.renderExplicitAddress(
        recipient.address,
        recipient.nickname,
      );
    } else if (ensResolution) {
      content = this.renderExplicitAddress(
        ensResolution,
        addressBookEntryName || userInput,
      );
    } else if (isUsingMyAccountsForRecipientSearch) {
      content = this.renderTransfer();
    }

    content = this.renderTransfer();
    return (
      <div className="send__select-recipient-wrapper">
        {this.renderDialogs()}
        {content || this.renderMain()}
      </div>
    );
  }

  renderExplicitAddress(address, name) {
    return (
      <div
        key={address}
        className="send__select-recipient-wrapper__group-item"
        onClick={() => this.selectRecipient(address, name)}
      >
        <Identicon address={address} diameter={28} />
        <div className="send__select-recipient-wrapper__group-item__content">
          <div className="send__select-recipient-wrapper__group-item__title">
            {name ? <Confusable input={name} /> : ellipsify(address)}
          </div>
          {name && (
            <div className="send__select-recipient-wrapper__group-item__subtitle">
              {ellipsify(address)}
            </div>
          )}
        </div>
      </div>
    );
  }

  renderTransfer() {
    let { ownedAccounts } = this.props;
    const {
      userInput,
      useContactListForRecipientSearch,
      isUsingMyAccountsForRecipientSearch,
    } = this.props;
    const { t } = this.context;

    if (isUsingMyAccountsForRecipientSearch && userInput) {
      ownedAccounts = ownedAccounts.filter(
        (item) =>
          item.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1 ||
          item.address.toLowerCase().indexOf(userInput.toLowerCase()) > -1,
      );
    }

    return (
      <div className="send__select-recipient-wrapper__list">
        <RecipientGroup
          label={t('myAccounts')}
          diameter={42}
          items={ownedAccounts}
          onSelect={this.selectRecipient}
        />
      </div>
    );
  }

  renderMain() {
    const { t } = this.context;
    const {
      userInput,
      ownedAccounts = [],
      addressBook,
      useMyAccountsForRecipientSearch,
    } = this.props;
    return (
      <div className="send__select-recipient-wrapper__list">
        <ContactList
          addressBook={addressBook}
          searchForContacts={this.searchForContacts.bind(this)}
          searchForRecents={this.searchForRecents.bind(this)}
          selectRecipient={this.selectRecipient.bind(this)}
        >
          {ownedAccounts && ownedAccounts.length > 1 && !userInput && (
            <Button
              type="link"
              className="send__select-recipient-wrapper__list__link"
              onClick={useMyAccountsForRecipientSearch}
            >
              {t('transferBetweenAccounts')}
            </Button>
          )}
        </ContactList>
      </div>
    );
  }

  renderDialogs() {
    const { ensError, recipient, ensWarning } = this.props;
    const { t } = this.context;

    if (ensError || (recipient.error && recipient.error !== 'required')) {
      return (
        <Dialog type="error" className="send__error-dialog">
          {t(ensError ?? recipient.error)}
        </Dialog>
      );
    } else if (ensWarning || recipient.warning) {
      return (
        <Dialog type="warning" className="send__error-dialog">
          {t(ensWarning ?? recipient.warning)}
        </Dialog>
      );
    }

    return null;
  }
}
