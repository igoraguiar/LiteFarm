import { within, userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import selectEvent from 'react-select-event';
import { convert } from '../../util/convert-units/convert';
import { getUnitOptionMap } from '../../util/convert-units/getUnitOptionMap';
import { roundToTwoDecimal } from '../../util';

/** Class used for testing Unit component. */
export default class UnitTest {
  constructor(canvasElement, testId, unitType = {}) {
    this.canvas = within(canvasElement);
    this.visibleInput = this.canvas.getByTestId(testId);
    this.hiddenInput = this.canvas.getByTestId(`${testId}-hiddeninput`);
    this.select = this.canvas.getByTestId(`${testId}-select`);
    this.testId = testId;
    this.unitType = unitType;
  }

  async clearInput() {
    await userEvent.clear(this.visibleInput);
  }

  async clearInputAndBlur() {
    await this.clearInput();
    await userEvent.click(document.body);
  }

  async clearError() {
    const clearButton = await this.canvas.findByTestId(`${this.testId}-errorclearbutton`);
    await userEvent.click(clearButton);
  }

  async inputValue(value) {
    await this.clearInput();
    await userEvent.type(this.visibleInput, value);
  }

  async inputValueAndBlur(value) {
    await this.inputValue(value);
    await userEvent.click(document.body);
  }

  async selectUnit(unit) {
    await selectEvent.openMenu(within(this.select).getByRole('combobox'));
    await selectEvent.select(within(this.select).getByRole('combobox'), unit);
  }

  async testSelectedUnit(selectedUnit) {
    const unit = await within(this.select).findByText(selectedUnit);
    expect(unit).toBeInTheDocument();
  }

  async testVisibleValue(value) {
    await waitFor(() => {
      expect(this.visibleInput).toHaveValue(value);
    });
  }

  /**
   * Test hidden value.
   * @param {number} value - Hidden value to test or visible value to convert.
   * @param {string} [selectedUnit] - Selected unit. Should not be passed with hidden value.
   * @param {string} [databaseUnit] - Database unit. Should not be passed with hidden value.
   * @return void
   */
  async testHiddenValue(value, selectedUnit, databaseUnit) {
    let hiddenValue = value;
    if (value && selectedUnit && databaseUnit) {
      hiddenValue = convert(value).from(selectedUnit).to(databaseUnit);
    }
    await waitFor(() => expect(this.hiddenInput).toHaveValue(hiddenValue));
  }

  async testNoInput() {
    await waitFor(() => {
      console.log(this.visibleInput, this.hiddenInput);
      expect(this.visibleInput).toHaveValue(null);
      expect(this.hiddenInput).toHaveValue(null);
    });
  }

  async testDisabledStatus() {
    await waitFor(() => {
      expect(this.visibleInput).toBeDisabled();
      expect(within(this.select).getByRole('combobox')).toBeDisabled();
    });
  }

  async testRequiredError() {
    const errorContainer = await this.canvas.findByTestId(`${this.testId}-errormessage`);
    expect(errorContainer).toHaveTextContent('Required');
  }

  async testMaxValueError() {
    const errorContainer = await this.canvas.findByTestId(`${this.testId}-errormessage`);
    expect(errorContainer).toHaveTextContent(/Please enter a value between 0-[0-9]./);
  }

  async testNoError() {
    await waitFor(() => {
      const clearButton = this.canvas.queryByTestId(`${this.testId}-errorclearbutton`);
      const requiredErrorElement = this.canvas.queryByText('Required');
      const maxValueErrorElement = this.canvas.queryByTestId(`${this.testId}-errorclearbutton`);
      expect(clearButton).not.toBeInTheDocument();
      expect(requiredErrorElement).not.toBeInTheDocument();
      expect(maxValueErrorElement).not.toBeInTheDocument();
    });
  }

  /**
   * Convert a value in the DB to a display value.
   * @param {number} value - Value retrieved from the DB (hidden value).
   * @param {string} displayUnit - Selected unit.
   * @return {number} A display value.
   */
  convertDBValueToDisplayValue(value, displayUnit) {
    return roundToTwoDecimal(convert(value).from(this.unitType.databaseUnit).to(displayUnit));
  }

  /**
   * Convert a display value to a hidden value.
   * @param {number} value - Display value.
   * @param {string} displayUnit - Selected unit.
   * @return {number} A hidden value.
   */
  convertDisplayValueToHiddenValue(value, displayUnit) {
    return convert(value).from(displayUnit).to(this.unitType.databaseUnit);
  }

  static getUnitLabelByValue(value) {
    return getUnitOptionMap()[value].label;
  }
}
