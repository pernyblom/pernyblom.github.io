package com.springworldgames.swing.valuecomponents;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;

import javax.swing.AbstractListModel;
import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JList;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JScrollPane;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;

import com.springworldgames.objectreader.ObjectReader;
import com.springworldgames.objectreader.ReadableObject;
import com.springworldgames.objectreader.common.DefaultReadableObject;

public class EditableListValueComponent extends ValueComponent {

	ArrayList<JComponent> otherComponents = new ArrayList<JComponent>();
	JList list;
	private MyListModel listModel;
	private boolean askBeforeRemove;
	String askRemoveMessage = "Really Delete?";
	String askRemoveTitle = "Confirm Delete";
	private boolean useUniqueIds;
	private LinkedHashSet<String> sharedUniqueIds;
	private String uniqueNamePrefix = "object";
	private ObjectReader reader;
	private HashMap<String, ReadableObject> allObjects;

	public static final String TARGET_COMPONENT = "editable_list_value_component_target_component";
	public static final String LIST_DIMENSION = "editable_list_value_component_list_dimension";

	public void setAskBeforeRemove(boolean ask) {
		this.askBeforeRemove = ask;
		;
	}

	public void setAskRemoveMessage(String askRemoveMessage) {
		this.askRemoveMessage = askRemoveMessage;
	}

	public void setAskRemoveStuff(boolean ask, String askRemoveMessage,
			String askRemoveTitle) {
		this.askBeforeRemove = ask;
		this.askRemoveMessage = askRemoveMessage;
		this.askRemoveTitle = askRemoveTitle;
	}

	String getUniqueName() {
		if (useUniqueIds && sharedUniqueIds != null) {
			int counter = 1;
			String result = uniqueNamePrefix + "_" + counter;
			while (sharedUniqueIds.contains(result)) {
				counter++;
				result = uniqueNamePrefix + "_" + counter;
			}
			return result;
		}
		return "object_1";
	}

	@Override
	public void setEnabled(boolean enabled) {
		super.setEnabled(enabled);
		list.setEnabled(enabled);
		for (JComponent b : otherComponents) {
			b.setEnabled(enabled);
		}
	}

	static class MyListModel extends AbstractListModel {

		List<ReadableObject> theList;

		public MyListModel(List<ReadableObject> l) {
			theList = l;
		}

		@Override
		public Object getElementAt(int arg0) {
			return theList.get(arg0);
		}

		@Override
		public int getSize() {
			return theList.size();
		}

		public void addObject(ReadableObject o) {
			theList.add(o);
			fireIntervalAdded(o, theList.size() - 1, theList.size() - 1);
		}

		public void removeObjectAtIndex(int index) {
			if (index < theList.size()) {
				Object object = theList.get(index);
				theList.remove(index);
				fireIntervalRemoved(object, index, index);
			}
		}

		public void removeObject(Object o) {
			int indexOf = theList.indexOf(o);
			if (indexOf != -1) {
				removeObjectAtIndex(indexOf);
			}
		}

	}

	@Override
	protected void setCurrentVerifiedValue(Object verifiedValue) {
		List currentValue = (List) verifiedValue;
		ArrayList copy = new ArrayList(currentValue);

		Iterator iterator = currentValue.iterator();

		int size = listModel.getSize();
		for (int i = 0; i < size; i++) {
			listModel.removeObjectAtIndex(0);
		}

		for (Object o : copy) {
			listModel.addObject((ReadableObject) o);
		}
	}

	public EditableListValueComponent(String propertyName, String caption,
			List<ReadableObject> theList,
			LinkedHashSet<Class<?>> collectionClasses,
			final ObjectReader reader,
			final HashMap<String, ReadableObject> allObjects) {
		this(propertyName, caption, theList, collectionClasses, reader,
				allObjects, new LinkedHashMap<String, Object>(), false, null);
	}

	public EditableListValueComponent(String propertyName, String caption,
			List<ReadableObject> theList,
			LinkedHashSet<Class<?>> collectionClasses,
			final ObjectReader reader,
			final HashMap<String, ReadableObject> allObjects,
			final LinkedHashMap<String, Object> preferenceProperties,
			final boolean useUniqueIds,
			final LinkedHashSet<String> sharedUniqueIds) {
		super(propertyName);
		this.useUniqueIds = useUniqueIds;
		this.sharedUniqueIds = sharedUniqueIds;
		this.reader = reader;
		this.allObjects = allObjects;

		setLayout(new BoxLayout(this, BoxLayout.X_AXIS));

		JPanel buttonColumn = new JPanel();
		buttonColumn.setLayout(new BoxLayout(buttonColumn, BoxLayout.Y_AXIS));

		list = new JList();
		JScrollPane scrollPane = new JScrollPane(list);
		Dimension listDim = (Dimension) preferenceProperties
				.get(LIST_DIMENSION);
		if (listDim == null) {
			listDim = new Dimension(200, 200);
		}

		scrollPane.setPreferredSize(listDim);

		listModel = new MyListModel(theList);
		list.setModel(listModel);

		final JComponent targetComponent = (JComponent) preferenceProperties
				.get(TARGET_COMPONENT);

		final EditableListValueComponent thisComponent = this;

		if (targetComponent != null) {
			list.addListSelectionListener(new ListSelectionListener() {
				@Override
				public void valueChanged(ListSelectionEvent e) {
					targetComponent.removeAll();
					if (list.getSelectedIndex() == -1) {
						// No selection
					} else {
						// Selection
						ReadableObject elementAt = (ReadableObject) listModel
								.getElementAt(list.getSelectedIndex());
						PFAContainerValueComponent component = new PFAContainerValueComponent(
								"PropName", "Caption", elementAt, allObjects,
								reader);
						JScrollPane scrollPane = new JScrollPane(component);
						targetComponent.add(scrollPane);
						targetComponent.revalidate();
						targetComponent.repaint();
					}
				}
			});
		}

		int buttonWidth = 50;

		if (collectionClasses != null) {
			boolean useNames = collectionClasses.size() > 1;

			if (useNames) {
				JPanel newPanel = new JPanel();
				newPanel.setLayout(new BoxLayout(newPanel, BoxLayout.Y_AXIS));
				newPanel.setBorder(BorderFactory.createTitledBorder("Add"));
				// newPanel.setBorder(BorderFactory.createCompoundBorder(
				// BorderFactory.createLineBorder(Color.black),
				// BorderFactory.createEmptyBorder(5, 5, 5, 5)));

				ButtonGroup bg = new ButtonGroup();

				final ArrayList<JRadioButton> radioButtons = new ArrayList<JRadioButton>();
				for (final Class<?> cc : collectionClasses) {
					JRadioButton rb = new JRadioButton(cc.getSimpleName(), true);
					rb.putClientProperty("create class", cc);
					radioButtons.add(rb);
					newPanel.add(rb);
					otherComponents.add(rb);
					bg.add(rb);
				}
				String buttonText = "New";
				JButton button = new JButton(buttonText);
				newPanel.add(button);
				buttonColumn.add(newPanel);
				buttonColumn.add(Box.createVerticalStrut(5));
				otherComponents.add(button);

				button.addActionListener(new ActionListener() {
					@Override
					public void actionPerformed(ActionEvent e) {
						for (JRadioButton rb : radioButtons) {
							if (rb.isSelected()) {
								Class<?> cc = (Class<?>) rb
										.getClientProperty("create class");
								createNewObject(cc);
								informAllListeners(listModel.theList,
										listModel.theList);
							}
						}
					}
				});

			} else {
				final Class<?> cc = collectionClasses.iterator().next();
				String buttonText = "New";
				JButton button = new JButton(buttonText);
				buttonColumn.add(button);
				buttonColumn.add(Box.createVerticalStrut(5));
				otherComponents.add(button);
				button.addActionListener(new ActionListener() {
					@Override
					public void actionPerformed(ActionEvent e) {
						createNewObject(cc);
						informAllListeners(listModel.theList, listModel.theList);
					}
				});
			}
		}

		JButton editButton = null;
		if (targetComponent == null) {
			editButton = new JButton("Edit");
			otherComponents.add(editButton);
			editButton.addActionListener(new ActionListener() {

				@Override
				public void actionPerformed(ActionEvent e) {
					int selectedIndex = list.getSelectedIndex();
					if (selectedIndex != -1) {
						ReadableObject elementAt = (ReadableObject) listModel
								.getElementAt(selectedIndex);
						// System.out.println(EditableListValueComponent.class
						// + " is editing " + elementAt);

						String idBefore = elementAt.getId();

						PFAContainerValueComponent component = new PFAContainerValueComponent(
								"PropName", "", elementAt, allObjects, reader);
						PFAContainerValueComponentDialog dialog = new PFAContainerValueComponentDialog(
								component);
						dialog.setVisible(true);

						if (useUniqueIds) {
							String idAfter = elementAt.getId();
							if (!idAfter.equals(idBefore)) {
								// User changed Id of object
								sharedUniqueIds.remove(idBefore);
								String newId = idBefore;
								if (sharedUniqueIds.contains(idAfter)) {
									// User entered an already existing id
									newId = showGetUniqueIdDialog();
									while (newId == null) {
										newId = showGetUniqueIdDialog();
										DefaultReadableObject ro = (DefaultReadableObject) elementAt;
										ro.id = newId;
									}
								}
								sharedUniqueIds.add(newId);
							}
						}
						informAllListeners(listModel.theList, listModel.theList);
					}
				}
			});
		}

		JButton deleteButton = new JButton("Delete");
		otherComponents.add(deleteButton);
		deleteButton.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent arg0) {
				int selectedIndex = list.getSelectedIndex();
				if (selectedIndex != -1) {
					boolean remove = true;
					if (askBeforeRemove) {
						int option = JOptionPane.showConfirmDialog(
								thisComponent, askRemoveMessage,
								askRemoveTitle, JOptionPane.OK_CANCEL_OPTION,
								JOptionPane.WARNING_MESSAGE);
						if (option != 0) {
							remove = false;
						}
					}
					if (remove) {
						if (useUniqueIds && sharedUniqueIds != null) {
							DefaultReadableObject ro = (DefaultReadableObject) listModel
									.getElementAt(selectedIndex);
							sharedUniqueIds.remove(ro.id);
						}
						listModel.removeObjectAtIndex(selectedIndex);
						informAllListeners(listModel.theList, listModel.theList);
					}
				}
			}
		});

		if (editButton != null) {
			buttonColumn.add(editButton);
			buttonColumn.add(Box.createVerticalStrut(5));
		}
		buttonColumn.add(deleteButton);
		buttonColumn.add(Box.createVerticalGlue());

		add(scrollPane);
		add(buttonColumn);
	}

	String showGetUniqueIdDialog() {
		Object value = JOptionPane.showInputDialog(this, "Enter Id",
				"Enter Id", JOptionPane.PLAIN_MESSAGE, null, null,
				getUniqueName());
		if (value != null) {
			String theId = value.toString();
			if (sharedUniqueIds.contains(theId)) {
				JOptionPane.showMessageDialog(this, "Id must be unique");
				return null;
			} else {
				return theId;
			}
		}
		return null;
	}

	protected void createNewObject(Class<?> cc) {
		try {
			String newId = null;
			if (useUniqueIds) {
				newId = showGetUniqueIdDialog();
			}
			if (newId != null || !useUniqueIds) {
				ReadableObject newInstance = (ReadableObject) cc.newInstance();
				newInstance.init(allObjects, reader);
				if (newId != null) {
					((DefaultReadableObject) newInstance).id = newId;
					sharedUniqueIds.add(newId);
				}
				listModel.addObject(newInstance);
			}
		} catch (Exception e1) {
			e1.printStackTrace();
		}
	}

	@Override
	public Object getCurrentValue() {
		MyListModel model = (MyListModel) list.getModel();
		return model.theList;
	}

}
