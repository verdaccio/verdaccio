import React from 'react';

import { fireEvent, render, screen } from '../../test/test-react-testing-library';
import type { Developer } from '../../types/packageMeta';
import Person from './Person';

const mockPerson: Developer = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://example.com/avatar.jpg',
  url: 'https://example.com/~johndoe',
};

const mockPackageName = 'test-package';
const mockVersion = '1.0.0';

const ComponentToBeRendered: React.FC<{ withText?: boolean }> = ({ withText = false }) => {
  return (
    <Person
      packageName={mockPackageName}
      person={mockPerson}
      version={mockVersion}
      withText={withText}
    />
  );
};

describe('Person component', () => {
  test('should render avatar', () => {
    render(<ComponentToBeRendered />);
    const avatar = screen.getByAltText(mockPerson.name);
    expect(avatar).toBeInTheDocument();
    // but not include text
    expect(screen.queryByText(mockPerson.name)).not.toBeInTheDocument();
  });

  test('should render name when withText is true', () => {
    render(<ComponentToBeRendered withText={true} />);
    const name = screen.getByText(mockPerson.name);
    expect(name).toBeInTheDocument();
  });

  test('should not render name when withText is false', async () => {
    render(<ComponentToBeRendered />);
    // hover over the avatar
    fireEvent.mouseEnter(screen.getByTestId(mockPerson.name));
    // wait for the tooltip to appear
    await screen.findByTestId(mockPerson.name + '-tooltip');
  });

  test('should render the gravatar sent by the sidebar endpoint as _avatar', () => {
    const person: Developer = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      _avatar: 'https://www.gravatar.com/avatar/1234',
    };
    render(<Person packageName={mockPackageName} person={person} version={mockVersion} />);
    const avatar = screen.getByAltText(person.name);
    expect(avatar.querySelector('img') ?? avatar).toBeInTheDocument();
    expect((avatar as HTMLImageElement).src).toBe('https://www.gravatar.com/avatar/1234');
  });
});
