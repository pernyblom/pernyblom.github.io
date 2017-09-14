package com.springworldgames.swing.valuecomponents;

import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.DefaultListModel;
import javax.swing.JButton;
import javax.swing.JList;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;

import com.springworldgames.objectreader.ObjectReader;
import com.springworldgames.objectreader.ReadableObject;

public class EnumArrayValueComponent extends ValueComponent {

	Object currentValue;

	JList list;

	private DefaultListModel listModel;

	private Class<?> enumClass;

	private Object[] enumConstants;

	ArrayList<JButton> buttons = new ArrayList<JButton>();
	
	@Override
	public void setEnabled(boolean enabled) {
		super.setEnabled(enabled);
		list.setEnabled(enabled);
		for (JButton b : buttons) {
			b.setEnabled(enabled);
		}
	}

	
	void setCurrentValueFromListModel() {
		int size = listModel.size();
		Object newArray = Array.newInstance(enumClass, size);
		for (int i=0; i<size; i++) {
			Object value = listModel.elementAt(i);
			Array.set(newArray, i, value);
		}
		Object oldValue = currentValue;
		currentValue = newArray;
		informAllListeners(oldValue, currentValue);
	}
	
	@Override
	protected void setCurrentVerifiedValue(Object verifiedValue) {
		currentValue = verifiedValue;
		updateList(currentValue);
	}

	void updateList(Object enumArray) {
		listModel.removeAllElements();
		int arrayLength = Array.getLength(enumArray);
		for (int i=0; i<arrayLength; i++) {
			Object object = Array.get(enumArray, i);
			listModel.addElement(object);
		}
	}

	public EnumArrayValueComponent(String propertyName, String caption,
			Object enumArray, final ObjectReader reader,
			final HashMap<String, ReadableObject> allObjects) {
		super(propertyName);

		this.currentValue = enumArray;
		
		setBorder(BorderFactory.createTitledBorder(caption));
		
		final EnumArrayValueComponent thisComponent = this;
		setLayout(new BoxLayout(this, BoxLayout.X_AXIS));

		Class<? extends Object> arrayClass = enumArray.getClass();
		if (arrayClass.isArray()) {
			Class<?> componentType = arrayClass.getComponentType();
			if (componentType.isEnum()) {
				// Okelidokeli
				enumClass = componentType;
				enumConstants = enumClass.getEnumConstants();
			}
		}

		JPanel buttonColumn = new JPanel();
		buttonColumn.setLayout(new BoxLayout(buttonColumn, BoxLayout.Y_AXIS));

		list = new JList();
		listModel = new DefaultListModel();
		
		// Add the initial stuff
		updateList(enumArray);
		
		list.setModel(listModel);
		JScrollPane scrollPane = new JScrollPane(list);
		scrollPane.setPreferredSize(new Dimension(200, 100));

		JButton addButton = new JButton("Add");
		buttons.add(addButton);
		addButton.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {

				Object result = JOptionPane.showInputDialog(thisComponent,
						"Add", "Add", JOptionPane.PLAIN_MESSAGE, null,
						enumConstants, enumConstants[0]);
				if (result != null) {
					listModel.addElement(result);
					setCurrentValueFromListModel();
				}
			}
		});
		JButton editButton = new JButton("Edit");
		buttons.add(editButton);
		editButton.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				int selectedIndex = list.getSelectedIndex();
				if (selectedIndex != -1) {
					Object elementAt = listModel.getElementAt(selectedIndex);
					Object result = JOptionPane.showInputDialog(thisComponent,
							"Add", "Add", JOptionPane.PLAIN_MESSAGE, null,
							enumConstants, elementAt);
					if (result != null) {
						listModel.set(selectedIndex, result);
						setCurrentValueFromListModel();
					}
				}
			}
		});

		JButton deleteButton = new JButton("Delete");
		buttons.add(deleteButton);

		deleteButton.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent arg0) {
				int selectedIndex = list.getSelectedIndex();
				if (selectedIndex != -1) {
					listModel.remove(selectedIndex);
					setCurrentValueFromListModel();
				}
			}
		});

		buttonColumn.add(addButton);
		buttonColumn.add(editButton);
		buttonColumn.add(deleteButton);

		add(scrollPane);
		add(buttonColumn);
	}

	@Override
	public Object getCurrentValue() {
		return currentValue;
	}

}
