(function () {
  var TOKEN = '41c18856748a4f86b1fd8bcd4f3b6d67';

  var HomeTeam = React.createClass({
    getInfo: function (url) {
      $.ajax({
        headers: { 'X-Auth-Token': TOKEN },
        url: url,
        dataType: 'json',
        success: function(data) {
          this.setState({
            crest: data.crestUrl,
            name: data.name
          });
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
    getInitialState: function() {
      return {
        crest: '',
        name: ''
      };
    },
    componentWillReceiveProps: function(nextProps) {
      if (nextProps.url) {
        this.getInfo(nextProps.url);
      }
    },
    render: function () {
      return (
        <span className="team">
          <img src={this.state.crest} /> {this.state.name}
        </span>
      );
    }
  });

  var AwayTeam = React.createClass({
    getInfo: function (url) {
      $.ajax({
        headers: { 'X-Auth-Token': TOKEN },
        url: url,
        dataType: 'json',
        success: function(data) {
          this.setState({
            crest: data.crestUrl,
            name: data.name
          });
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
    getInitialState: function() {
      return {
        crest: '',
        name: ''
      };
    },
    componentWillReceiveProps: function(nextProps) {
      if (nextProps.url) {
        this.getInfo(nextProps.url);
      }
    },
    render: function () {
      return (
        <span className="team">
          {this.state.name} <img src={this.state.crest} />
        </span>
      );
    }
  });

  var DateDisplay = React.createClass({
    render: function () {
      var dt = moment(this.props.date);
      return (
        <div className="dateDisplay" title={dt.format('LLLL')}>
          {this.props.date ? dt.fromNow() : 'loading'}
        </div>
      );
    }
  });

  var LastGame = React.createClass({
    render: function(){
      return (
        <div className="lastGames container">
          <h6>Check out the last results</h6>
            {
              this.props.lastGame.map(function(lastGame) {
                return (
                  <div className="row" title={moment(lastGame.date).format('LLLL')}>
                    <div className="four columns"><b>{lastGame.homeTeamName}</b></div>
                    <div className="four columns">
                      <span>{lastGame.result.goalsHomeTeam}</span>
                      <span>&nbsp;x&nbsp;</span>
                      <span>{lastGame.result.goalsAwayTeam}</span>
                    </div>
                    <div className="four columns"><b>{lastGame.awayTeamName}</b></div>
                  </div>
                )
              })
            }
        </div>
    )
    }
  });

  var Board = React.createClass({
    getInitialState: function() {
      return {
        date: '',
        home_team_url: '',
        away_team_url: '',
        last_game: []
      };
    },
    componentDidMount: function() {
      $.ajax({
        headers: { 'X-Auth-Token': TOKEN },
        url: this.props.url,
        dataType: 'json',
        success: function(data) {
          for (var i = 0; i < data.count; i++) {
            var date = data.fixtures[i].date;
            if (moment().isBefore(date)) {
              this.setState({
                date: date,
                home_team_url: data.fixtures[i]._links.homeTeam.href,
                away_team_url: data.fixtures[i]._links.awayTeam.href
              });
              break;
            }
            else {
              var last_game = this.state.last_game;
              last_game.unshift(data.fixtures[i]);
              this.setState({last_game: last_game.slice(0, 3)});
            }
          }
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
    render: function () {
      return (
        <section className="board">
          <DateDisplay date={this.state.date} />
          <HomeTeam url={this.state.home_team_url} />
          &nbsp;x&nbsp;
          <AwayTeam url={this.state.away_team_url} />
          <div class="u-cf"></div>
          <LastGame lastGame={this.state.last_game} />
        </section>
      );
    }
  });

  ReactDOM.render(
    <Board url="https://api.football-data.org/v1/teams/61/fixtures" />,
    document.getElementById('content')
  );
})();
