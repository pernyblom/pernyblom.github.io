package com.springworldgames.swing.valuecomponents;

import java.awt.event.MouseListener;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.swing.JPanel;

import com.springworldgames.jcgmusic.ArrayUtils;
import com.springworldgames.jcgmusic.ParseUtils;
import com.springworldgames.objectreader.ObjectReader;
import com.springworldgames.objectreader.ReadableObject;
import com.springworldgames.objectreader.common.PropertyFieldAssociation;
import com.springworldgames.objectreader.common.ValidatedProperties;

public abstract class ValueComponent extends JPanel {

	protected static ScriptEngineManager scriptManager;
	protected static ScriptEngine scriptEngine;

	StringBuilder errors = new StringBuilder();
	StringBuilder warnings = new StringBuilder();

	protected String propertyName;

	LinkedHashSet<PropertyChangeListener> listeners = new LinkedHashSet<PropertyChangeListener>();

	LinkedHashSet<ValueValidator> validators = new LinkedHashSet<ValueValidator>();

	ValidatedProperties vp;

	protected void setCurrentVerifiedValue(Object verifiedValue) {
		System.out.println("setCurrentVerifiedValue() not implemented for "
				+ getClass().getSimpleName());
	}

	public void setCurrentValue(Object newValue) {
		setCurrentValue(newValue, new StringBuilder(), new StringBuilder());
	}
	
	
	public void setCurrentValue(Object newValue, StringBuilder errors,
			StringBuilder warnings) {
		Object currentValue = getCurrentValue();
		// The current value is used for parsing
		if (currentValue.getClass() == newValue.getClass()) {
			// We just keep the newValue
		} else {
			if (newValue instanceof String) {
				newValue = ParseUtils.parseObjectFromString((String) newValue,
						currentValue);
				if (newValue == null) {
					System.out
							.println(getClass().getSimpleName()
									+ " failed to set current value because parse error "
									+ newValue + " targetClass: "
									+ currentValue.getClass());
				}
			} else {
				System.out
						.println(getClass().getSimpleName()
								+ " failed to set currentValue because the new value was wrong class "
								+ newValue.getClass());
			}
		}

		boolean valueIsValid = valueIsValid(newValue, errors, warnings);
		if (valueIsValid) {
			setCurrentVerifiedValue(newValue);
		} else {
			System.out.println(getClass().getSimpleName()
					+ " did not find the value ok " + newValue);
		}
	}

	void createScriptEngineIfNecessary() {
		if (scriptManager == null) {
			scriptManager = new ScriptEngineManager();
			scriptEngine = scriptManager.getEngineByName("js");
		}
	}

	public void setValidatedProperties(ValidatedProperties pfa) {
		this.vp = pfa;
	}

	public ValueComponent(String propertyName) {
		super();
		this.propertyName = propertyName;
		// setPreferredSize(new Dimension(200, 80));
	}

	protected boolean valueIsValid(Object value, StringBuilder errors,
			StringBuilder warnings) {
		boolean result = true;
		if (vp != null) {
			if (!vp.valueOK(propertyName, value, errors)) {
				result = false;
			}
		}

		for (ValueValidator v : validators) {
			if (!v.validValue(value, errors, warnings)) {
				result = false;
			}
		}
		return result;
	}

	public String getWarnings() {
		return warnings.toString();
	}

	public String getErrors() {
		return errors.toString();
	}

	public void addValueValidator(ValueValidator v) {
		validators.add(v);
	}

	public void addValueChangeListener(PropertyChangeListener l) {
		listeners.add(l);
	}

	protected void informAllListeners(Object oldValue, Object newValue) {
		PropertyChangeEvent evt = new PropertyChangeEvent(this, propertyName,
				oldValue, newValue);
		for (PropertyChangeListener l : listeners) {
			l.propertyChange(evt);
		}
	}

	public abstract Object getCurrentValue();

	// object, reader and allObjects can all be null but then some components
	// can not be created.
	public static ValueComponent createValueComponent(String propertyName,
			final ValidatedProperties vp, final ReadableObject object,
			Object value, ObjectReader reader,
			HashMap<String, ReadableObject> allObjects) {
		if (value == null) {
			System.out.println(ValueComponent.class
					+ " value was null for property " + propertyName);
			return null;
		}
		ValueComponent comp = null;

		if (value instanceof Integer) {
			int intValue = (Integer) value;
			Integer minValue = vp.getIntPropertyMinValue(propertyName);
			Integer maxValue = vp.getIntPropertyMaxValue(propertyName);

			Collection<Object> enumerables = vp.getEnumerables(propertyName);
			if (enumerables != null && enumerables.size() > 0) {
				Integer[] values = enumerables.toArray(new Integer[0]);
				String[] names = ArrayUtils.getToStringArray(values);
				comp = new EnumerableComboboxWithLabel(propertyName,
						propertyName, intValue, values, names);
			} else if (minValue != null && maxValue != null
					&& minValue != Integer.MIN_VALUE
					&& maxValue != Integer.MAX_VALUE) {
				comp = new IntegerSliderSpinnerWithLabel(propertyName,
						propertyName, intValue, minValue, maxValue, 1);
			} else {
				comp = new IntegerTextfieldWithLabel(propertyName,
						propertyName, intValue);
			}
		} else if (value instanceof Boolean) {
			comp = new BooleanRadioButtonsWithLabel(propertyName, propertyName,
					(Boolean) value);
		} else if (value instanceof String) {
			String stringValue = (String) value;

			Collection<Object> enumerables = vp.getEnumerables(propertyName);
			if (enumerables != null && enumerables.size() > 0) {
				String[] values = enumerables.toArray(new String[0]);
				String[] names = ArrayUtils.getToStringArray(values);
				comp = new EnumerableComboboxWithLabel(propertyName,
						propertyName, stringValue, values, names);
			} else {
				// comp = new StringTextfieldWithLabel(s, s, stringValue);
				comp = new StringTextArea(propertyName, propertyName,
						stringValue);
			}
		} else if (value instanceof Double) {
			double doubleValue = (Double) value;

			Double minValue = null;
			Double maxValue = null;
			Collection<Object> enumerables = null;

			if (vp != null) {
				minValue = vp.getDoublePropertyMinValue(propertyName);
				maxValue = vp.getDoublePropertyMaxValue(propertyName);
				enumerables = vp.getEnumerables(propertyName);
			}

			if (enumerables != null && enumerables.size() > 0) {
				Double[] values = enumerables.toArray(new Double[0]);
				String[] names = ArrayUtils.getToStringArray(values);
				comp = new EnumerableComboboxWithLabel(propertyName,
						propertyName, doubleValue, values, names);
			} else if (minValue != null && maxValue != null
					&& minValue != Double.NEGATIVE_INFINITY
					&& maxValue != Double.POSITIVE_INFINITY) {
				comp = new DoubleSliderSpinnerWithLabel(propertyName,
						propertyName, doubleValue, minValue, maxValue, 1.0);
				// System.out.println(getClass() + " got minValue to "
				// + minValue + " " + maxValue);
			} else {
				comp = new DoubleTextfieldWithLabel(propertyName, propertyName,
						doubleValue);
			}
		} else if (value instanceof List) {
			List<ReadableObject> collectionValue = (List<ReadableObject>) value;
			LinkedHashSet<Class<?>> listClasses = vp
					.getListClasses(propertyName);
			comp = new EditableListValueComponent(propertyName, propertyName,
					collectionValue, listClasses, reader, allObjects);
		} else if (value instanceof ReadableObject) {
			ReadableObject objectValue = (ReadableObject) value;
			comp = new ReadableObjectButtonWithLabel(propertyName,
					propertyName, objectValue, reader, allObjects);
		} else if (value.getClass().isEnum()) {
			Class<? extends Object> theClass = value.getClass();
			List list = Arrays.asList(theClass.getEnumConstants());
			Object[] values = list.toArray();
			String[] names = ArrayUtils.getToStringArray(values);
			comp = new EnumerableComboboxWithLabel(propertyName, propertyName,
					value, values, names);
		} else if (value.getClass().isArray()) {
			if (value instanceof double[]) {
				comp = new DoubleArrayTextfieldWithLabel(propertyName,
						propertyName, (double[]) value);
			} else if (value instanceof int[]) {
				comp = new IntegerArrayTextfieldWithLabel(propertyName,
						propertyName, (int[]) value);
			} else if (value instanceof int[][]) {
				comp = new IntegerIntegerArrayTextfieldWithLabel(propertyName,
						propertyName, (int[][]) value);
			} else {
				Class<? extends Object> theClass = value.getClass();
				Class<?> arrayType = theClass.getComponentType();

				if (arrayType.isEnum()) {
					comp = new EnumArrayValueComponent(propertyName,
							propertyName, value, reader, allObjects);
				} else {
					System.out
							.println(ValueComponent.class
									+ " not able to create component for an array of type "
									+ theClass + " " + propertyName);
				}
			}
		} else {
			System.out.println(ValueComponent.class
					+ " unable to create component for " + value.getClass()
					+ " " + propertyName);
		}

		if (comp != null) {
			comp.setValidatedProperties(vp);
			if (vp instanceof PropertyFieldAssociation && object != null) {
				final PropertyFieldAssociation pfa = (PropertyFieldAssociation) vp;
				comp.addValueChangeListener(new PropertyChangeListener() {
					@Override
					public void propertyChange(PropertyChangeEvent evt) {
						pfa.setProperty(object, evt.getPropertyName(), evt
								.getNewValue());
					}
				});
			}
		} else {
			System.out.println(ValueComponent.class
					+ " could not create component for " + value
					+ " propName: " + propertyName);
		}
		return comp;
	}
	
	public void addMouseListenerForAllInputComponents(MouseListener l) {
	}
}
