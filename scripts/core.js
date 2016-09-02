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

  var Board = React.createClass({
    getInitialState: function() {
      return {
        date: '',
        home_team_url: '',
        away_team_url: ''
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
        </section>
      );
    }
  });

  ReactDOM.render(
    <Board url="http://api.football-data.org/v1/teams/61/fixtures" />,
    document.getElementById('content')
  );
})();
