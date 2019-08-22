import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  ScenarioList,
  ScenarioDivider,
  ScenarioHeader,
  ScenarioOption,
  MenuSeparatorLine,
  IconContainer,
  Icon
} from "./ScenarioSelectionList.style";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeaf, faDatabase, faBolt, faBatteryFull} from '@fortawesome/free-solid-svg-icons'

const ScenarioSelectionList = props => {
  const { t } = useTranslation();
  const handleChange = (event, value) => {
    props.updateScenarioSelection(event, props.name, value);
  };

  const { dimensionOptions, dimensionTitle, narrowVersion } = props;
  let stringValue = props.selectedValue.toString();
  let stringValue2 = props.selectedValue2.toString();
  let scenarioOptions = dimensionOptions
    .filter(option => option.ccs === props.showCCS && option.opt1 === props.showOpt1 && option.opt2 === props.showOpt2 && option.opt3 === props.showOpt3)
    .map(option => {
      let optionValue = option.nameNoOptions;
      if (optionValue === "division_line") {
        return <MenuSeparatorLine key={option.id} />;
      } else {
        return (
          <ScenarioOption
            key={option.id}
            value={optionValue}
            selected={optionValue === stringValue}
            selected2={optionValue === stringValue2}
            onClick={event => handleChange(event, optionValue)}
            narrowVersion={narrowVersion}
          >
            {narrowVersion === false && t("scenario."+option.short_description)}
            {narrowVersion === true && t("scenario."+option.ultra_short_description)}
            <IconContainer>
              <Icon><FontAwesomeIcon icon={faDatabase}/></Icon>
              <Icon><FontAwesomeIcon icon={faLeaf}/></Icon>
              <Icon><FontAwesomeIcon icon={faBolt}/></Icon>
              <Icon><FontAwesomeIcon icon={faBatteryFull}/></Icon>
            </IconContainer>
          </ScenarioOption>
        );
      }
    });
  return (
    <ScenarioList>
      <ScenarioDivider />
      <ScenarioHeader narrowVersion={narrowVersion}>
        {dimensionTitle}
      </ScenarioHeader>
      {scenarioOptions}
    </ScenarioList>
  );
};

ScenarioSelectionList.propTypes = {
  updateScenarioSelection: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  selectedValue: PropTypes.any.isRequired,
  selectedValue2: PropTypes.any.isRequired,
  dimensionOptions: PropTypes.array.isRequired,
  dimensionTitle: PropTypes.string.isRequired,
  narrowVersion: PropTypes.bool.isRequired,
  showCCS: PropTypes.bool.isRequired,
  showOpt1: PropTypes.bool.isRequired,
  showOpt2: PropTypes.bool.isRequired,
  showOpt3: PropTypes.bool.isRequired
};

export default ScenarioSelectionList;
