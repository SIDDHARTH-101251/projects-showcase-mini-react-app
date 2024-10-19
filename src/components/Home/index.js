import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const status = {
  initial: 'INITIAL',
  loading: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category: props.category || [], // Ensure category is an array.
      projects: [], // Change projects to be an array.
      currStatus: status.initial,
      option: 'ALL',
    }
  }

  componentDidMount() {
    this.getData()
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {projects} = this.state
    console.log(projects)
    return (
      <ul className="main-content-container">
        {projects.map(eachItem => (
          <li className="project-card" key={eachItem.id}>
            <img
              src={eachItem.image_url}
              alt={eachItem.name}
              className="project-image"
            />
            <div className="project-name-container">
              <p className="project-name">{eachItem.name}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  getData = async () => {
    this.setState({
      currStatus: status.loading,
    })
    const {option} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${option}`

    try {
      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        this.setState({
          currStatus: status.success,
          projects: data.projects,
        })
      } else {
        this.setState({
          currStatus: status.failure,
        })
      }
    } catch (err) {
      this.setState({
        currStatus: status.failure,
      })
    }
  }

  onClickRetry = () => {
    this.getData()
  }

  onChangeOption = event => {
    console.log(event.target.value)
    this.setState(
      {
        option: event.target.value,
      },
      this.getData, // Ensure the API call happens after the state update.
    )
  }

  render() {
    const {category, currStatus} = this.state

    let view
    switch (currStatus) {
      case status.loading:
        view = this.renderLoadingView()
        break
      case status.success:
        view = this.renderSuccessView()
        break
      case status.failure:
        view = this.renderFailureView()
        break
      default:
        view = null
    }

    return (
      <div className="app-container">
        <div className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>
        <form className="form-style">
          <select
            className="select-option-style"
            onChange={this.onChangeOption}
          >
            {category.map(eachItem => (
              <option key={eachItem.id} value={eachItem.id}>
                {eachItem.displayText}
              </option>
            ))}
          </select>
        </form>
        <div>{view}</div>
      </div>
    )
  }
}

export default Home
