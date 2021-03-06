import DexMaskTemplateRenderer, {
  SectionShape,
} from '@c/app/dexmask-template-renderer';
import { useI18nContext } from '@view/hooks/useI18nContext';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * DexMaskTranslation is a simple helper Component for adding full translation
 * support to the template system. We do pass the translation function to the
 * template getValues function, but passing it React components as variables
 * would require React to be in scope, and breaks the object pattern paradigm.
 *
 * This component gets around that by converting variables that are templates
 * themselves into tiny React trees. This component does additional validation
 * to make sure that the tree has a single root node, with maximum two leaves.
 * Each subnode can have a maximum of one child that must be a string.
 *
 * This enforces a maximum recursion depth of 2, preventing translation strings
 * from being performance hogs. We could further limit this, and also attenuate
 * the safeComponentList for what kind of components we allow these special
 * trees to contain.
 */
export default function DexMaskTranslation({ translationKey, variables }) {
  const t = useI18nContext();

  return t(
    translationKey,
    variables?.map((variable) => {
      if (
        typeof variable === 'object' &&
        !Array.isArray(variable) &&
        variable.element
      ) {
        if (!variable.key) {
          throw new Error(
            `When using MetaMask Template Language in a DexMaskTranslation variable, you must provide a key for the section regardless of syntax.
            Section with element '${variable.element}' for translationKey: '${translationKey}' has no key property`,
          );
        }
        if (
          variable.children &&
          Array.isArray(variable.children) &&
          variable.children.length > 2
        ) {
          throw new Error(
            'DexMaskTranslation only renders templates with a single section and maximum two children',
          );
        } else if (
          (variable.children?.[0]?.children !== undefined &&
            typeof variable.children[0].children !== 'string') ||
          (variable.children?.[1]?.children !== undefined &&
            typeof variable.children[1].children !== 'string')
        ) {
          throw new Error(
            'DexMaskTranslation does not allow for component trees of non trivial depth',
          );
        }
        return (
          <DexMaskTemplateRenderer
            key={`${translationKey}-${variable.key}`}
            sections={variable}
          />
        );
      }
      return variable;
    }),
  );
}

DexMaskTranslation.propTypes = {
  translationKey: PropTypes.string.isRequired,
  variables: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.shape(SectionShape),
    ]),
  ),
};
