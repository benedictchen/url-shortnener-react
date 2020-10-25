import React from 'react';
import logo from './logo.svg';
import './App.css';

export const ACCESS_TOKEN = 'd4c5c79b77c09411fe3bd19b141aac72';
export const GB_API_ENDPOINT = 'http://api.bely.me';


interface AppState {
  data: Array<any>;
  urlToShorten: string;
  newItem: UrlItem|null;
  currentRequest: Promise<any>|null;
};

interface UrlItem {
  url: string;
  short_url: string;
  slug: string;
}


export class App extends React.Component<{}, AppState> {

  state: AppState;

  textInput = React.createRef<typeof HTMLInputElement|null>();

  constructor(props:any) {
    super(props);

    this.state = {
      data: [],
      urlToShorten: '',
      newItem: null,
      currentRequest: null,
    };
  }

  componentDidMount() {
    this.getAllLinks();
  }

  getAllLinks() {
    const request = fetch(GB_API_ENDPOINT + '/links', {
      // credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'GB-Access-Token': ACCESS_TOKEN,
      },
    }).then((response) => {
      return response.json();
    }).then((data) => {
      this.setState({ data, currentRequest: null });
    }).catch((error) => {
      this.setState({ currentRequest: null });
      throw error;
    });

    this.setState({
      currentRequest: request,
    });
  }

  async createLink(url: string) {
    const request = fetch(GB_API_ENDPOINT + '/links', {
      // credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'GB-Access-Token': ACCESS_TOKEN,
      },
      body: JSON.stringify({
        'url': url,
      }),
    }).then((response) => {
      return response.json();
    }).then((data) => {
       this.setState({
         urlToShorten: '',
         newItem: data,
         currentRequest: null,
       });
    }).catch((error) => {
      this.setState({
        currentRequest: null,
      });
      alert('failed!');
    });

    this.setState({
      currentRequest: request,
    });

    await request;
    this.getAllLinks();
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      urlToShorten: event.target.value,
    })
  }

  handleSubmit(event: React.ChangeEvent<HTMLInputElement>|
                      React.FormEvent<HTMLFormElement>|
                      React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    this.createLink(this.state.urlToShorten);
  }

  handleDelete(item: UrlItem) {
    if (!item) {
      throw new TypeError('Nothing to delete.');
    }
    const request = fetch(GB_API_ENDPOINT + `/links/${item.slug}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'GB-Access-Token': ACCESS_TOKEN,
      },
    }).then((response) => {
      this.getAllLinks();
    });
  }

  render() {
    return (
      <div className="app">
        <div className="controls">
        { (!this.state.currentRequest) ? (
          <form onSubmit={this.handleSubmit.bind(this)}>
            <input type="url"
                   ref={(this.textInput as unknown) as string}
                   onChange={this.handleChange.bind(this)}/>
            <button className="submit" onClick={this.handleSubmit.bind(this)}>
              Shorten
            </button>
          </form> ) : null
        }
        </div>
        {
          (this.state.newItem) ?
          <div className="created">
            <h3>Shortened URL</h3>
            <h4>Original</h4>
            <p>{this.state.newItem?.url}</p>
            <h4>Shortened</h4>
            <p>{this.state.newItem?.short_url}</p>
          </div> : null
        }

        <h3>All shortened URLS</h3>
        <ul>
        {this.state?.data?.map((datum: UrlItem, i) => {
          return (
            <li key={i} className="url-item">
            {datum['url']} → {datum['short_url']}
            <button className="delete-button"
                    onClick={this.handleDelete.bind(this, datum)}>
              ×
            </button>
            </li>
          );
        })}
        </ul>
      </div>
    );
  }

}
