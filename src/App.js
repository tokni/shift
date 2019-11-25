import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Route, withRouter, Switch } from 'react-router-dom'
import ReactGA from 'react-ga'
import LeftMenu from './leftMenu/LeftMenu'
import LeftMenuMobile from './leftMenu/LeftMenu.mobile'
import Tabs from './tabs/Tabs'
import TabsMobile from './tabs/Tabs.mobile'
import Charts from './charts/Charts'
import ChartsTab2 from './charts/ChartsTab2'
import PageRenderer from './pages/PageRenderer'
import Prerequisites from './pages/Prerequisites'
import scenarioCombinations from './data/scenarioCombinations'

ReactGA.initialize('UA-145591344-2')
ReactGA.pageview(window.location.pathname + window.location.search)

const Page = styled.div`
  height: 100%;
  margin: 0px;
  display: flex;
  box-sizing: border-box;
`
const Column = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const Content = styled.div`
  flex-grow: 1; /*ensures that the container will take up the full height of the parent container*/
  overflow-y: auto; /*adds scroll to this container*/
  overflow-x: hidden;
`
const MainSwitch = styled(Switch)`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-content: flex-start;
`

export const changeScenario = (name, value) => ({
  [name]: value,
})

const default_scenario = "Nordic_ShiftAvoid";
const options = []
scenarioCombinations.scenarioCombinations.scenarioOptions
  .filter(s => !s.ccs && !s.bio && !s.opt2 && !s.opt3)
  .forEach(s => {
    options[s.nameNoOptions] = {}
    options[s.nameNoOptions]['ccs'] = false
    options[s.nameNoOptions]['bio'] = false
    options[s.nameNoOptions]['opt2'] = false
    options[s.nameNoOptions]['opt3'] = false
  })

export class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scenarioSelection: default_scenario,
      scenarioSelection2: '',
      showWelcome: true,
      showDifference: false,
      options: options,
      scenarioSelectionNoOptions: default_scenario,
      scenarioSelectionNoOptions2: '',
      selectedCountries: ['no'],
  }
    this.scenarioCombinations = scenarioCombinations.scenarioCombinations
  }

  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
  }
  UpdateScenarioNames = () => {
    this.setState(state => {
      return {
        scenarioSelection:
          state.scenarioSelectionNoOptions +
          (state.options[state.scenarioSelectionNoOptions].ccs ? '_ccs' : '') +
          (state.options[state.scenarioSelectionNoOptions].bio ? '_bio' : '') +
          (false ? '_opt2' : '') +
          (false ? '_opt3' : ''),
      }
    })
    this.setState(state => {
      return {
        scenarioSelection2:
          state.scenarioSelectionNoOptions2 !== ''
            ? state.scenarioSelectionNoOptions2 +
              (state.options[state.scenarioSelectionNoOptions2].ccs
                ? '_ccs'
                : '') +
              (state.options[state.scenarioSelectionNoOptions2].bio ? '_bio' : '') +
              (false ? '_opt2' : '') +
              (false ? '_opt3' : '')
            : '',
      }
    })
  }
  unselectToggles = (scenario) => {
    let newOptions = this.state.options
    Object.keys(this.state.options[scenario]).forEach(option => {
      newOptions[scenario][option] = false
    })
    this.setState({
      options: newOptions,
    })
  }
  UpdateScenarioSelection = (e, name, value) => {
    e.preventDefault()
    if (this.state.scenarioSelectionNoOptions2 !== '') {
      if (value === this.state.scenarioSelectionNoOptions) {
        this.setState(
          changeScenario(
            'scenarioSelectionNoOptions',
            this.state.scenarioSelectionNoOptions2
          )
        )
        this.setState(changeScenario('scenarioSelectionNoOptions2', ''))
        this.unselectToggles(this.state.scenarioSelectionNoOptions2)
        this.setState({ showDifference: false })
      } else {
        if (value === this.state.scenarioSelectionNoOptions2) {
          this.setState(changeScenario('scenarioSelectionNoOptions2', ''))
          this.unselectToggles(this.state.scenarioSelectionNoOptions2)
          this.setState({ showDifference: false })
        } else {
          this.setState(changeScenario('scenarioSelectionNoOptions2', value))
        }
      }
    } else {
      if (value !== this.state.scenarioSelectionNoOptions) {
        this.setState(changeScenario('scenarioSelectionNoOptions2', value))
      }
    }
    this.UpdateScenarioNames()
  }


  CloseWelcomeWidget = () => {
    this.setState({ showWelcome: false })
  }

  ToggleDifference = e => {
    e.preventDefault()
    this.setState({ showDifference: !this.state.showDifference })
  }

  ToggleOption = (scenario, option) => {
    let newOptions = this.state.options
    newOptions[scenario][option] = !this.state.options[scenario][option]
    this.setState({
      options: newOptions,
    })
    this.UpdateScenarioNames()
  }

  selectCountry = country => {
    let newSelectedCountries = this.state.selectedCountries
    if (newSelectedCountries.includes(country)) {
      newSelectedCountries = newSelectedCountries.filter(c => c !== country)
    } else {
      newSelectedCountries.push(country)
    }
    this.setState({
      selectedCountries: newSelectedCountries,
    })
  }
  render() {
    return (
      <Page>
        <Column>
          <Content>
            <LeftMenu
              selectedChartgroup={this.state.scenarioSelection}
              scenarioSelection={this.state}
              scenarioCombinations={this.scenarioCombinations}
              updateScenarioSelection={this.UpdateScenarioSelection}
              toggleDifference={this.ToggleDifference}
              options={this.state.options}
              toggleOption={this.ToggleOption}
              selectedCountries={this.state.selectedCountries}
              selectCountry={this.selectCountry}
            />
            <LeftMenuMobile
              selectedChartgroup={this.state.scenarioSelection}
              scenarioSelection={this.state}
              scenarioCombinations={this.scenarioCombinations}
              updateScenarioSelection={this.UpdateScenarioSelection}
              toggleDifference={this.ToggleDifference}
              options={this.state.options}
              toggleOption={this.ToggleOption}
              selectedCountries={this.state.selectedCountries}
              selectCountry={this.selectCountry}
            />
          </Content>
        </Column>
        <Column>
          <Content>
            <Tabs selectedChartgroup={this.props.location.pathname} />
            <TabsMobile selectedChartgroup={this.props.location.pathname} />
            <MainSwitch>
              <Route
                exact
                path="/"
                render={() => (
                  <Charts
                    scenarioSelection={this.state}
                    closeWelcome={this.CloseWelcomeWidget}
                    selectedCountries={this.state.selectedCountries}
                  />
                )}
              />
              <Route
                path="/tab2"
                render={() => (
                  <ChartsTab2
                    scenarioSelection={this.state}
                    closeWelcome={this.CloseWelcomeWidget}
                    selectedCountries={this.state.selectedCountries}
                  />
                )}
              />
              <Route
                path="/about"
                render={() => {
                  return (
                    <PageRenderer markdownFiles={['descriptions/about.md']} />
                  )
                }}
              />
              <Route
                path="/beskrivelser"
                render={() => {
                  return (
                    <PageRenderer
                      markdownFiles={[
                        'descriptions/0_intro.md',
                        'descriptions/1_reference.md',
                        'descriptions/2_marienlyst.md',
                        'descriptions/3_comets.md',
                        'descriptions/4_co2_budget.md',
                      ]}
                    />
                  )
                }}
              />
              <Route path="/forudsaetninger" component={Prerequisites} />
              <Route
                path="/udfordringer"
                render={() => {
                  return (
                    <PageRenderer
                      markdownFiles={[
                        'descriptions/challenges.md',
                        'descriptions/udfordringer_omstilling.md',
                        'descriptions/udfordringer_reduktion.md',
                      ]}
                    />
                  )
                }}
              />
            </MainSwitch>
          </Content>
        </Column>
      </Page>
    )
  }
}

export default withRouter(App)
