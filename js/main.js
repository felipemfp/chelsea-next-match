(function () {
  const React = window.React
  const ReactDOM = window.ReactDOM
  const $ = window.$
  const moment = window.moment

  const TOKEN = '41c18856748a4f86b1fd8bcd4f3b6d67'

  const Team = React.createClass({
    getInfo: function (url) {
      if (url.indexOf('http:') > -1) {
        url = url.replace('http:', 'https:')
      }
      $.ajax({
        headers: { 'X-Auth-Token': TOKEN },
        url: url,
        dataType: 'json',
        success: function (data) {
          this.setState({
            crest: data.crestUrl,
            name: data.name
          })
        }.bind(this),
        error: function (xhr, status, err) {
          console.error(this.props.url, status, err.toString())
        }.bind(this)
      })
    },
    getInitialState: function () {
      return {
        crest: '',
        name: ''
      }
    },
    componentWillReceiveProps: function (nextProps) {
      if (nextProps.url) {
        this.getInfo(nextProps.url)
      }
    },
    render: function () {
      if (this.props.isHome) {
        return (
          <span className='team'>
            <img src={this.state.crest} /> {this.state.name}
          </span>
        )
      }
      return (
        <span className='team'>
          {this.state.name} <img src={this.state.crest} />
        </span>
      )
    }
  })

  const DateDisplay = React.createClass({
    render: function () {
      var dt = moment(this.props.date)
      return (
        <div className='dateDisplay' title={dt.format('LLLL')}>
          {this.props.date ? dt.fromNow() : 'loading'}
        </div>
      )
    }
  })

  const LastGameContainer = React.createClass({
    render: function () {
      return (
        <div className='lastGames container'>
          <h6>Check out the last games</h6>
          {
              this.props.lastGames.map(function (lastGame) {
                return (
                  <div className='row' title={moment(lastGame.date).format('LLLL')}>
                    <div className='four columns'><b>{lastGame.homeTeamName}</b></div>
                    <div className='four columns'>
                      <span>{lastGame.result.goalsHomeTeam}</span>
                      <span>&nbsp;x&nbsp;</span>
                      <span>{lastGame.result.goalsAwayTeam}</span>
                    </div>
                    <div className='four columns'><b>{lastGame.awayTeamName}</b></div>
                  </div>
                )
              })
            }
        </div>
      )
    }
  })

  const Board = React.createClass({
    getInitialState: function () {
      return {
        date: '',
        homeTeamUrl: '',
        awayTeamUrl: '',
        lastGames: []
      }
    },
    componentDidMount: function () {
      $.ajax({
        headers: { 'X-Auth-Token': TOKEN },
        url: this.props.url,
        dataType: 'json',
        success: function (data) {
          for (let i = 0; i < data.count; i++) {
            let date = data.fixtures[i].date
            if (moment().isBefore(date)) {
              this.setState({
                date: date,
                homeTeamUrl: data.fixtures[i]._links.homeTeam.href,
                awayTeamUrl: data.fixtures[i]._links.awayTeam.href
              })
              break
            } else {
              let lastGames = this.state.lastGames
              lastGames.unshift(data.fixtures[i])
              this.setState({lastGames: lastGames.slice(0, 3)})
            }
          }
        }.bind(this),
        error: function (xhr, status, err) {
          console.error(this.props.url, status, err.toString())
        }.bind(this)
      })
    },
    render: function () {
      return (
        <section className='board'>
          <DateDisplay date={this.state.date} />
          <Team isHome url={this.state.homeTeamUrl} />
          &nbsp;x&nbsp;
          <Team url={this.state.awayTeamUrl} />
          <div class='u-cf' />
          <LastGameContainer lastGames={this.state.lastGames} />
        </section>
      )
    }
  })

  ReactDOM.render(
    <Board url='https://api.football-data.org/v1/teams/61/fixtures' />,
    document.getElementById('content')
  )
})()
