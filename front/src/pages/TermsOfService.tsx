import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function TermsOfService() {
	const { t } = useTranslation();
	return (
		<div className="fixed inset-0 bg-[#050505] text-[#33ff00] font-mono p-8 overflow-y-scroll">
				<div className="max-w-4xl mx-auto">
						<div className="flex justify-between items-center mb-8 border-b-2 border-[#33ff00] pb-4">
								<h1 className="text-3xl uppercase tracking-[4px] animate-text-flicker">
										{t('termsofservice.title')}
								</h1>
								<Link
										to="/"
										className="font-bold text-[1rem] uppercase bg-black py-2 px-4 border border-[#33ff00] hover:bg-[#33ff00] hover:text-black transition-all"
								>
										{t('termsofservice.return')}
								</Link>
						</div>

						<div className="space-y-8 text-[0.95rem] leading-relaxed">
								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('termsofservice.acceptance.title')}
										</h2>
										<p className="opacity-90">{t('termsofservice.acceptance.text')}</p>
								</section>

								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('termsofservice.description.title')}
										</h2>
										<p className="opacity-90">{t('termsofservice.description.text')}</p>
										<ul className="list-disc list-inside ml-4 space-y-1 mt-2 opacity-90">
												<li>{t('termsofservice.description.features.realtime')}</li>
												<li>{t('termsofservice.description.features.tournament')}</li>
												<li>{t('termsofservice.description.features.profiles')}</li>
												<li>{t('termsofservice.description.features.friends')}</li>
												<li>{t('termsofservice.description.features.leaderboards')}</li>
										</ul>
								</section>

								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('termsofservice.accounts.title')}
										</h2>
										<div className="space-y-3 opacity-90">
												<p>{t('termsofservice.accounts.text')}</p>
												<ul className="list-disc list-inside ml-4 space-y-1">
														<li>{t('termsofservice.accounts.provide')}</li>
														<li>{t('termsofservice.accounts.security')}</li>
														<li>{t('termsofservice.accounts.responsibility')}</li>
														<li>{t('termsofservice.accounts.notify')}</li>
														<li>{t('termsofservice.accounts.noshare')}</li>
												</ul>
										</div>
								</section>

								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('termsofservice.conduct.title')}
										</h2>
										<p className="opacity-90 mb-3">{t('termsofservice.conduct.text')}</p>
										<ul className="list-disc list-inside ml-4 space-y-1 opacity-90">
												<li>{t('termsofservice.conduct.cheats')}</li>
												<li>{t('termsofservice.conduct.disrupt')}</li>
												<li>{t('termsofservice.conduct.unauthorized')}</li>
												<li>{t('termsofservice.conduct.harass')}</li>
												<li>{t('termsofservice.conduct.offensive')}</li>
												<li>{t('termsofservice.conduct.laws')}</li>
												<li>{t('termsofservice.conduct.manipulate')}</li>
										</ul>
								</section>

								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('termsofservice.fairplay.title')}
										</h2>
										<p className="opacity-90">{t('termsofservice.fairplay.text')}</p>
								</section>

								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('termsofservice.intellectual.title')}
										</h2>
										<p className="opacity-90">{t('termsofservice.intellectual.text')}</p>
								</section>

								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('termsofservice.availability.title')}
										</h2>
										<p className="opacity-90">{t('termsofservice.availability.text')}</p>
								</section>

								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('termsofservice.termination.title')}
										</h2>
										<p className="opacity-90">{t('termsofservice.termination.text')}</p>
								</section>

								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('termsofservice.liability.title')}
										</h2>
										<p className="opacity-90">{t('termsofservice.liability.text')}</p>
								</section>

								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('termsofservice.changes.title')}
										</h2>
										<p className="opacity-90">{t('termsofservice.changes.text')}</p>
								</section>

								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('termsofservice.contact.title')}
										</h2>
										<p className="opacity-90">
												{t('termsofservice.contact.text')}{' '}
												<a
														href="mailto:guaglio.jordan@gmail.com"
														className="text-[#33ff00] underline ml-1"
												>
														{t('termsofservice.contact.email')}
												</a>
										</p>
								</section>

								<section className="border-t border-[#33ff00] pt-6 mt-8">
										<p className="text-sm opacity-70">{t('termsofservice.updated')}</p>
								</section>
						</div>
				</div>
		</div>
	);
}
