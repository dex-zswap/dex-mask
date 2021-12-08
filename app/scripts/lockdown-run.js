// Freezes all intrinsics
try {
  // eslint-disable-next-line no-undef,import/unambiguous
  lockdown({
    consoleTaming: 'unsafe',
    errorTaming: 'unsafe',
    mathTaming: 'unsafe',
    dateTaming: 'unsafe',
    overrideTaming: 'severe',
  });
} catch (error) {
  console.error('Lockdown failed:', error);
}
