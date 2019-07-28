import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import BottomAppBar from './BottomAppBar';
import WebDevAtlantaLogo from '../assets/images/WDA-logo.png';
import Draggable from 'react-draggable';

class Layout extends Component {
  constructor(props) {
    super(props);
    let namesArray = [];
    for (let i = 0; i < props.data.cards.length; i++) {
      namesArray.push({"name": undefined})
    }
    this.state = {
      showName: true,
      names: namesArray
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onNameKeyDown = this.onNameKeyDown.bind(this);
  }

  /**
   * Handles the name change input event.
   * @param {Int} index The index of the array element for the name
   * @param {*} e The event from the name change.
   */
  onNameChange(index, e) {
    let namesArrayCopy = [...this.state.names];
    namesArrayCopy[index] = e.target.value;
    this.setState({names: namesArrayCopy})
  }

  /**
   * Enter key event hanlder for name input/guess of name.
   * @param {Int} index The index in the array of the name selected.
   * @param {*} e The event from the enter key press.
   */
  onNameKeyDown(index, e) {
    if (e.key === 'Enter') {
      let answer = this.props.data.cards[index].name.toUpperCase().split(' ')[0];
      let guess = e.target.value.toUpperCase().split(' ')[0];
      let guessResult = answer === guess;

      if (guessResult) {
        alert(`
        Your guess was: ${guess}. 
        The answer is ${answer}. 
        You got it right!
        `);
      } else {
        alert(`
        Your guess was: ${guess}. 
        The answer is ${answer}. 
        Sorry you got it wrong!
        `);
      }
    }
  }

  render() {
    const {classes} = this.props;
    return (
        <>
          <CssBaseline />
          <main>
            {/* Hero unit */}
            <div className={classes.heroContent}>
              <Container maxWidth="sm">
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <img id="logo" src={WebDevAtlantaLogo} alt="WebDevAtlanta primary logo" />
                  </Grid>
                  <Grid item>
                    <Typography variant="h5" align="center" color="textSecondary" paragraph>
                      Web Dev Atlanta is a meetup focused on web and software development. We meet and work on group projects and discuss topics in the area of web development. This group is open to all levels of coders!
                </Typography>
                  </Grid>
                </Grid>
                <div className={classes.heroButtons}>
                  <Grid container spacing={2} justify="center">
                    <Grid item>
                      <Button variant="contained" color="secondary">
                        Join Us!
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </Container>
            </div> {/* End hero unit */}
    
            <Container className={classes.cardGrid} maxWidth="md">
            
            <Grid 
              item
              style={{marginBottom: '10px'}}
            >
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => this.setState({showName: !this.state.showName})}
              >
                {this.state.showName ? "Hide Name" : "Show Name"}
              </Button>
            </Grid>
    
              {/* Valid cards are show here */}
              <Grid container spacing={4}>
                {this.props.data.cards.filter(card => !card.error).map((card, index) => (
                  <Grid item key={card.name} xs={12} sm={6} md={4}>
                    <Draggable
                      axis="both"
                      handle=".handle"
                      defaultPosition={{x: 0, y: 0}}
                      position={null}
                      grid={[25, 25]}
                      scale={1}
                    >
                      <Card className={[classes.card, "handle"]} style={{cursor: 'grab'}}>
                        <CardMedia
                          className={classes.cardMedia}
                          image={card.profile.avatar}
                          title="Member"
                        />
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {
                              this.state.showName ? 
                                card.name
                              : 
                                <input
                                  type="text"
                                  name={card.github_username.toUpperCase() + '-' + index}
                                  data-id={index}
                                  id={card.github_username.toUpperCase() + '-' + index}
                                  value={this.state.names[index].name}
                                  className="name"
                                  onChange={(e) => this.onNameChange(index, e)}
                                  onMouseDown={e => e.stopPropagation()}
                                  onKeyDown={(e) => this.onNameKeyDown(index, e)}
                                />
                            }
                          </Typography>
                          <Typography>
                            {card.profile.status}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <a href={ card.github_url }>
                            <Button className={ classes.palette } size="small" color="primary" >
                              View
                            </Button>
                          </a>
                        </CardActions>
                      </Card>
                    </Draggable>
                  </Grid>
                ))}
              </Grid>
              
    
              {/* Cards with errors are shown here */}
              <Grid container spacing={4}>
                {this.props.data.cards.filter(card => !(!card.error)).map(card => (
                  <Grid item key={card.name} xs={12} sm={6} md={4}>
                    <Card className={classes.card}>
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {card.name}
                        </Typography>
                        <Typography>
                          <a href={card.gist_url}>{card.error.message}</a>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
            <BottomAppBar></BottomAppBar>
          </main>
          {/* Footer */}
          <footer className={classes.footer}>
            <Typography variant="h6" align="center" gutterBottom>
              &copy; WebDevAtlanta 2019
            </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
              -social media here-
            </Typography>
          </footer>
          {/* End footer */}
        </>
    );
  }
}

const styles = theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  }
});

export default withStyles(styles)(Layout);