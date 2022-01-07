import React, { Component } from 'react'
import { ethers } from 'ethers'
import Fuse from 'fuse.js'
import PropTypes from 'prop-types'
import TextField from '@c/ui/text-field'
import { getAllAssets } from '@view/helpers/cross-chain-api'
export default class TokenSearch extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }
  state = {
    searchQuery: '',
  }
  fuse = null
  contractList = null

  async componentDidMount() {
    const { chainId } = this.props
    const resp = await getAllAssets()
    const res = await resp.json()

    if (res.c === 200) {
      this.contractList = res.d
        .filter(
          ({ meta_chain_id, token_address }) =>
            meta_chain_id === chainId &&
            token_address !== ethers.constants.AddressZero,
        )
        .map(
          ({
            decimals,
            token: symbol,
            token_address: address,
            token_name: name,
          }) => ({
            address,
            decimals,
            name,
            symbol,
            chainId,
            erc20: true,
          }),
        )
      this.fuse = new Fuse(this.contractList, {
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
            name: 'symbol',
            weight: 0.5,
          },
        ],
      })
    }
  }

  componentWillUnmount() {
    this.contractList = null
    this.fuse = null
  }

  handleSearch(searchQuery) {
    this.setState({
      searchQuery,
    })

    if (searchQuery) {
      const fuseSearchResult = this.fuse.search(searchQuery)
      const addressSearchResult = this.contractList.filter((token) => {
        return token.address.toLowerCase() === searchQuery.toLowerCase()
      })
      const results = [...addressSearchResult, ...fuseSearchResult]
      this.props.onSearch({
        searchQuery,
        results,
      })
    } else {
      this.props.onSearch({
        searchQuery,
        results: [],
      })
    }
  }

  render() {
    const { error } = this.props
    const { searchQuery } = this.state
    return (
      <TextField
        id='search-tokens'
        className='search-token'
        placeholder={this.context.t('searchTokens')}
        type='text'
        value={searchQuery}
        onChange={(e) => this.handleSearch(e.target.value)}
        error={error}
        fullWidth
        autoFocus
        autoComplete='off'
      />
    )
  }
}
