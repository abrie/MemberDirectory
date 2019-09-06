import React, {useState, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import {makeStyles} from '@material-ui/styles';
import * as AuthAPI from '../api/AuthAPI';
import * as ProfileAPI from '../api/ProfileAPI';

function themedStyles(theme) {
  return {
    grid: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(1),
    },
    card: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
    },
    activeCard: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'yellow',
    },
    cardMedia: {
      paddingTop: '56.25%', // 16:9
    },
    cardContent: {
      flexGrow: 1,
    },
  }
}

const useStyles = makeStyles(themedStyles);

export default function({auth, member_masterlist}) {
  const classes = useStyles();

  const [authResult, setAuthResult] = useState({})
  const [members, setMembers] = useState([])
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    async function getAuthorization(config) {
      const result = await AuthAPI.getAuthorization(config)
      setAuthResult(result)
      if (result.access_token) {
        const directory = await ProfileAPI.fetchDirectory(member_masterlist);
        setMembers(directory.members);
      }
    }

    getAuthorization(auth);
  }, [auth, member_masterlist])

  useEffect(() => {
    console.log(edit);
  },[edit])

  function MemberCard({member, active}) {
    const className = active ? classes.activeCard : classes.card;
    return (
      <Card className={className} onClick={ () => setEdit(member) }>
        <span>{member.name}/{member.github_username}</span>
        <small>{member.gist_id}</small>
      </Card>
    )
  }

  return (
    <Container className={classes.grid} maxWidth="md">
      { authResult.access_token &&
        <Grid container className={classes.grid} spacing={10}>{members.map( (member, index) => (
          <MemberCard member={member} key={`${index}`} active={member.name === edit.name}/>))}
        </Grid>
      }
      { authResult.error &&
          <span>
            The auth middleware is not reachable. Is it running?
          </span>
      }
      { authResult.redirect &&
        <span>
          <Button
            variant="contained"
            color="secondary"
            href={`${authResult.redirect}`}>
            Login Using GitHub
          </Button>
        </span>
      }
    </Container>
  )
}
