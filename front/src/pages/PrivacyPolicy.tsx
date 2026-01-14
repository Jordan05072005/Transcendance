import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
	const { t } = useTranslation();

	return (
		<div className="fixed inset-0 bg-[#050505] text-[#33ff00] font-mono p-8 overflow-y-scroll">
				<div className="max-w-4xl mx-auto">
						<div className="flex justify-between items-center mb-8 border-b-2 border-[#33ff00] pb-4">
								<h1 className="text-3xl uppercase tracking-[4px] animate-text-flicker">
										{t('privacypolicy.title')}
								</h1>
								<Link
										to="/"
										className="font-bold text-[1rem] uppercase bg-black py-2 px-4 border border-[#33ff00] hover:bg-[#33ff00] hover:text-black transition-all"
								>
										{t('privacypolicy.return')}
								</Link>
						</div>

						<div className="space-y-8 text-[0.95rem] leading-relaxed">
								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('privacypolicy.introduction.title')}
										</h2>
										<p className="opacity-90">
												{t('privacypolicy.introduction.text')}
										</p>
								</section>

								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('privacypolicy.collect.title')}
										</h2>

										<div className="space-y-4 opacity-90">
												<div>
														<h3 className="text-[#33ff00] mb-2">
																{t('privacypolicy.collect.account.title')}
														</h3>
														<ul className="list-disc list-inside ml-4 space-y-1">
																<li>{t('privacypolicy.collect.account.username')}</li>
																<li>{t('privacypolicy.collect.account.password')}</li>
																<li>{t('privacypolicy.collect.account.2fa')}</li>
														</ul>
												</div>

												<div>
														<h3 className="text-[#33ff00] mb-2">
																{t('privacypolicy.collect.game.title')}
														</h3>
														<ul className="list-disc list-inside ml-4 space-y-1">
																<li>{t('privacypolicy.collect.game.history')}</li>
																<li>{t('privacypolicy.collect.game.tournaments')}</li>
																<li>{t('privacypolicy.collect.game.stats')}</li>
														</ul>
												</div>

												<div>
														<h3 className="text-[#33ff00] mb-2">
																{t('privacypolicy.collect.technical.title')}
														</h3>
														<ul className="list-disc list-inside ml-4 space-y-1">
																<li>{t('privacypolicy.collect.technical.tokens')}</li>
																<li>{t('privacypolicy.collect.technical.browser')}</li>
																<li>{t('privacypolicy.collect.technical.timestamps')}</li>
														</ul>
												</div>
										</div>
								</section>

								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('privacypolicy.usage.title')}
										</h2>
										<ul className="list-disc list-inside ml-4 space-y-2 opacity-90">
												<li>{t('privacypolicy.usage.auth')}</li>
												<li>{t('privacypolicy.usage.service')}</li>
												<li>{t('privacypolicy.usage.leaderboards')}</li>
												<li>{t('privacypolicy.usage.social')}</li>
												<li>{t('privacypolicy.usage.tournaments')}</li>
												<li>{t('privacypolicy.usage.security')}</li>
										</ul>
								</section>

								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('privacypolicy.security.title')}
										</h2>
										<p className="opacity-90">
												{t('privacypolicy.security.text')}
										</p>
								</section>

								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('privacypolicy.sharing.title')}
										</h2>
										<p className="opacity-90">
												{t('privacypolicy.sharing.text')}
										</p>
								</section>

								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('privacypolicy.rights.title')}
										</h2>
										<ul className="list-disc list-inside ml-4 space-y-2 opacity-90">
												<li>{t('privacypolicy.rights.access')}</li>
												<li>{t('privacypolicy.rights.update')}</li>
												<li>{t('privacypolicy.rights.delete')}</li>
												<li>{t('privacypolicy.rights.2fa')}</li>
												<li>{t('privacypolicy.rights.visibility')}</li>
										</ul>
								</section>

								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('privacypolicy.cookies.title')}
										</h2>
										<p className="opacity-90">
												{t('privacypolicy.cookies.text')}
										</p>
								</section>

								<section>
										<h2 className="text-xl uppercase mb-4 text-[#2a9d8f]">
												{t('privacypolicy.contact.title')}
										</h2>
										<p className="opacity-90">
												{t('privacypolicy.contact.text')}{' '}
												<a
														href="mailto:guaglio.jordan@gmail.com"
														className="text-[#33ff00] underline ml-1"
												>
														{t('privacypolicy.contact.email')}
												</a>
										</p>
								</section>

								<section className="border-t border-[#33ff00] pt-6 mt-8">
										<p className="text-sm opacity-70">
												{t('privacypolicy.updated')}
										</p>
								</section>
						</div>
				</div>
		</div>
	);
}
