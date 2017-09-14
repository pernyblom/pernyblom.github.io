package com.springworldgames.swing.valuecomponents;

import java.awt.Color;
import java.awt.Dimension;

import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JLabel;
import javax.swing.JTextField;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;

import com.springworldgames.jcgmusic.ArrayUtils;
import com.springworldgames.jcgmusic.ParseUtils;

public class DoubleDoubleArrayTextfieldWithLabel extends ValueComponent {

	double[][] currentValue = new double[0][0];

	JLabel label;
	JTextField tf;

	Color origBackground;

	boolean checkElementValue;
	int minValue;
	int maxValue;
	boolean checkArity;
	int minArity;
	int maxArity;

	@Override
	public void setEnabled(boolean enabled) {
		super.setEnabled(enabled);
		tf.setEnabled(enabled);
	}
	
	public DoubleDoubleArrayTextfieldWithLabel(String propertyName,
			String caption, double[][] startValue, boolean checkElementValue,
			int minValue, int maxValue, boolean checkArity, int minArity,
			int maxArity) {
		super(propertyName);
		this.checkElementValue = checkElementValue;
		this.minValue = minValue;
		this.maxValue = maxValue;
		this.checkArity = checkArity;
		this.minArity = minArity;
		this.maxArity = maxArity;

		setLayout(new BoxLayout(this, BoxLayout.X_AXIS));

		if (caption != null) {
			label = new JLabel(caption);
			label.setAlignmentX(LEFT_ALIGNMENT);
			add(label);
		}
		currentValue = startValue.clone();
		tf = new JTextField(ArrayUtils.toStringWithoutBrackets(startValue),
				Math.max(10, Math.min(startValue.length * 2, 25)));
		tf.setAlignmentX(RIGHT_ALIGNMENT);
		tf.setPreferredSize(new Dimension(100, 30));
		tf.setMaximumSize(new Dimension(100, 30));

		tf.getDocument().addDocumentListener(new DocumentListener() {
			public void changedUpdate(DocumentEvent e) {
				validateText();
			}

			public void removeUpdate(DocumentEvent e) {
				validateText();
			}

			public void insertUpdate(DocumentEvent e) {
				validateText();
			}
		});

		origBackground = tf.getBackground();
		add(Box.createHorizontalGlue());
		add(tf);
	}

	public DoubleDoubleArrayTextfieldWithLabel(String propertyName,
			String labelText, double[][] startValue) {
		this(propertyName, labelText, startValue, false, 0, 0, false, 0, 0);
	}

	public void validateText() {
		String text = tf.getText();

		errors = new StringBuilder();
		warnings = new StringBuilder();
		try {
			double[][] testValue = ParseUtils.parseDoubleDoubleArr(text);
			setIfValid(testValue, false);
		} catch (NumberFormatException e) {
			tf.setBackground(Color.red);
		}
	}

	private void setIfValid(double[][] testValue) {
		setIfValid(testValue, false);
	}

	@Override
	protected boolean valueIsValid(Object value, StringBuilder errors,
			StringBuilder warnings) {
		double[][] val = (double[][]) value;
		if (checkElementValue) {
			for (double[] arr : val) {
				for (double v : arr) {
					if (v < minValue || v > maxValue) {
						errors.append("Element value must be between "
								+ minValue + " and " + maxValue);
						return false;
					}
				}
			}
		}
		if (checkArity) {
			for (double[] arr : val) {
				if (arr.length < minArity || arr.length > maxArity) {
					errors.append("Array arity error. Must be between "
							+ minArity + " and " + maxArity);
					return false;
				}
			}
		}
		return super.valueIsValid(value, errors, warnings);
	}

	private void setIfValid(double[][] testValue, boolean force) {
		if (valueIsValid(testValue, errors, warnings)) {
			double[][] oldValue = currentValue;
			currentValue = testValue;
			tf.setBackground(origBackground);
			informAllListeners(oldValue, currentValue);
		} else {
			tf.setBackground(Color.red);
		}
	}

	public double[][] getCurrentValue() {
		return currentValue;
	}

	public void setCurrentValue(double[][] v, boolean force) {
		setIfValid(v, force);
	}

	public void setCurrentValue(double[][] v) {
		setIfValid(v);
	}

}
